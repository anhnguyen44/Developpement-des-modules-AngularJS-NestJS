import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Franchise } from '../../resource/franchise/franchise';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../resource/user/user.service';
import { UserStore } from '../../resource/user/user.store';
import { ValidationService } from '../../resource/validation/validation.service';
import { NotificationService } from '../../notification/notification.service';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { delay } from 'q';
import { GrilleTarifService } from '../../resource/grille-tarif/grille-tarif.service';
import { Utilisateur } from '@aleaac/shared/src/models/utilisateur.model';
import { fadeIn, fadeOut } from '../../resource/animation';

@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class FranchiseComponent implements OnInit {
  @Input() superAdminId: number;
  userModalOpened: boolean = false;
  canEditSiege: Promise<boolean>;
  canEditSiegeSync: boolean;
  franchise: Franchise;
  franchiseForm: FormGroup;
  assuranceForm: FormGroup;
  administrationForm: FormGroup;
  submittedInformations: boolean = false;
  submittedAssurance: boolean = false;
  submittedAdministration: boolean = false;

  errorsInformations: string[] = new Array<string>();
  errorsAssurance: string[] = new Array<string>();
  errorsAdministration: string[] = new Array<string>();

  champsInformations: Map<string, string> = new Map<string, string>([
    ['raisonSociale', 'La raison sociale'],
    ['numeroContrat', 'Le numéro de contrat'],
    ['statutJuridique', 'Le statut juridique'],
    ['rcs', 'Le numéro RCS'],
    ['naf', 'Le code NAF'],
    ['numeroTVA', 'Le numéro intracommunautaire de TVA'],
    ['pourcentTVADefaut', 'Le pourcentage par défaut de TVA'],
    ['nomPrenomSignature', 'Le nom du franchisé'],
  ]);

  champsAssurance: Map<string, string> = new Map<string, string>([
    ['raisonSociale', 'La raison sociale'],
    ['numeroContrat', 'Le numéro de contrat'],
    ['statutJuridique', 'Le statut juridique'],
    ['rcs', 'Le numéro RCS'],
    ['naf', 'Le code NAF'],
    ['numeroTVA', 'Le numéro intracommunautaire de TVA'],
  ]);

  champsAdministration: Map<string, string> = new Map<string, string>([

  ]);

  constructor(
    private menuService: MenuService,
    private franchiseService: FranchiseService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userStore: UserStore,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private router: Router,
    private serviceGrilleTarif: GrilleTarifService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // console.log(this.superAdminId);
    this.canEditSiege = this.userStore.hasProfil(profils.SUPER_ADMIN).then(value => {
      this.canEditSiegeSync = value;
      return of(value).toPromise();
    });

    // On l'assigne ici pour avoir la bonne valeur dans le validator
    this.franchiseForm = this.formBuilder.group({
      id: [null, null],
      raisonSociale: ['', Validators.required],
      numeroContrat: ['', null],
      statutJuridique: ['', Validators.required],
      rcs: ['', [Validators.pattern(/^([a-zéèëêàùô]+\s*[\/'-]?\s*)+\s*\d{3}\s*\d{3}\s*\d{3}$/i)]],
      siret: ['', [Validators.pattern('[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{5}')]],
      naf: ['', []],
      numeroTVA: ['', [Validators.pattern('[A-Z]{2}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}')]],
      pourcentTVADefaut: ['', [Validators.min(2.1), Validators.max(20)]],
      nomPrenomSignature: ['', ],
      capitalSocial: ['', ],
    },
      {
        validators: [this.validationService.RequireIf('numeroContrat', this.canEditSiegeSync)]
      }); // TODO : Gérant (civilite, nom, prenom)

    this.assuranceForm = this.formBuilder.group({
      compagnieAssurance: ['', Validators.required],
      adresseCompagnieAssurance: ['', Validators.required],
      dateValiditeAssurance: ['', Validators.required],
      montantAnnuelGaranti: ['', null],
      numeroContratRCP: ['', null]
    },
      {
        validators: [
          this.validationService.RequireIf('montantAnnuelGaranti', this.canEditSiegeSync)
          , this.validationService.RequireIf('numeroContratRCP', this.canEditSiegeSync)
        ]
      });

    this.administrationForm = this.formBuilder.group({
      datePremiereSignature: ['', null],
      dateSignatureContratEnCours: ['', null],
      dateFinContratEnCours: ['', null],
      dateDemarrage: ['', null],
      trigramme: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    },
      {
      });

    // console.log(this.superAdminId);
    if (this.superAdminId === undefined) {
      this.franchiseService.franchise.subscribe((franchise) => {
        if (franchise) {
          this.franchiseService.getWithUsers(franchise.id).subscribe(franch => {
            console.log(franch);
            this.franchise = franch;
            if (this.franchise.users) {
              this.franchise.users!.forEach(userWithProfiles => {
                if (userWithProfiles.profils) {
                  userWithProfiles.profils = userWithProfiles.profils!.filter(pro => pro.idFranchise === this.franchise.id);
                }

                this.menuService.setMenu([
                  ['Paramétrage', '/parametrage'],
                  ['Infos franchise', '']
                ]);
              });
            }

            this.franchiseForm.patchValue(this.franchise);
            this.assuranceForm.patchValue(this.franchise);
            this.administrationForm.patchValue(this.franchise);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
          });
        }
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    } else if (this.superAdminId === 0) {
      this.franchise = new Franchise();
    } else {
      this.franchiseService.getWithUsers(this.superAdminId).subscribe(franch => {
        // console.log(franch);
        this.franchise = franch;
        if (this.franchise.users) {
          this.franchise.users!.forEach(userWithProfiles => {
            if (userWithProfiles.profils) {
              userWithProfiles.profils = userWithProfiles.profils!.filter(pro => pro.idFranchise === this.franchise.id);
            }
          });
        }
        this.franchiseForm.patchValue(this.franchise);
        this.assuranceForm.patchValue(this.franchise);
        this.administrationForm.patchValue(this.franchise);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }
  }

  onSubmitInformations() {
    let doNotContinue = false;
    if (!this!.validateInformations()) {
      doNotContinue = true;
    }

    if (doNotContinue === true) {
      this.notificationService.setNotification('danger', this.errorsInformations);
      return;
    }

    this.franchise = { ...this.franchise, ...this.franchiseForm.value };

    if (this.franchise && this.franchise.id && this.franchise.id > 0) {
      this.franchiseService.updateFranchise(this.franchise!).subscribe(() => {
        this.notificationService.setNotification('success', ['Informations mises à jour.']);
        this.franchiseForm.markAsPristine();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    } else {
      this.franchiseService.createFranchise(this.franchise!).subscribe((fr) => {
        this.notificationService.setNotification('success', ['Franchise créée.']);
        const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
        this.router.navigate([moduleToUse + '/franchise/modifier/' + fr.id]);
        this.franchiseForm.markAsPristine();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }
  }

  validateInformations() {
    this.submittedInformations = true;
    this.errorsInformations = [];
    // stop here if form is invalid
    if (this.franchiseForm.invalid) {
      this.errorsInformations = this.validationService.getFormValidationErrors(this.franchiseForm, this.champsInformations);
      return false;
    } else {
      return true;
    }
  }

  onSubmitAssurance() {
    let doNotContinue = false;
    if (!this!.validateAssurance()) {
      doNotContinue = true;
    }

    if (doNotContinue === true) {
      this.notificationService.setNotification('danger', this.errorsAssurance);
      return;
    }

    this.franchise = { ...this.franchise, ...this.assuranceForm.value };

    if (this.franchise) {
      this.franchiseService.updateFranchise(this.franchise!).subscribe(() => {
        this.notificationService.setNotification('success', ['Informations d\'assurances et ASN mises à jour.']);
        this.assuranceForm.markAsPristine();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }
  }

  validateAssurance() {
    this.submittedAssurance = true;
    this.errorsAssurance = [];
    // stop here if form is invalid
    if (this.assuranceForm.invalid) {
      this.errorsAssurance = this.validationService.getFormValidationErrors(this.assuranceForm, this.champsAssurance);
      return false;
    } else {
      return true;
    }
  }

  onSubmitAdministration() {
    let doNotContinue = false;
    if (!this!.validateAdministration()) {
      doNotContinue = true;
    }

    if (doNotContinue === true) {
      this.notificationService.setNotification('danger', this.errorsAdministration);
      return false;
    }

    this.franchise = { ...this.franchise, ...this.administrationForm.value };

    if (this.franchise) {
      this.franchiseService.updateFranchise(this.franchise!).subscribe(() => {
        this.notificationService.setNotification('success', ['Informations administratives mises à jour.']);
        this.administrationForm.markAsPristine();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }
  }

  validateAdministration() {
    this.submittedAdministration = true;
    this.errorsAdministration = [];
    // stop here if form is invalid
    if (this.administrationForm.invalid) {
      this.errorsAdministration = this.validationService.getFormValidationErrors(this.administrationForm, this.champsAdministration);
      return false;
    } else {
      return true;
    }
  }

  async doSortieReseau() {
    if (confirm('Voulez-vous vraiment sortir cette franchise du réseau ? Cette opération est irréversible.')) {
      if (prompt('Pour confirmer la sortie veuillez taper "SORTIE" en majuscules.') === 'SORTIE') {
        this.franchiseService.sortieReseau(this.franchise.id).subscribe(res => {
          if (res) {
            this.notificationService.setNotification('warning', ['La fanchise a été sortie du réseau.']);
          } else {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          }
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.error(err);
        });
      } else {
        this.notificationService.setNotification('dark', ['Veuillez confirmer en tapant "SORTIE" pour sortir la fanchise du réseau.']);
      }
    }
  }

  async doGenerateGrilles() {
    console.log(this.franchise.id);
    this.serviceGrilleTarif.initGrillesFranchise(this.franchise.id).subscribe(data => { }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  editProfilsUser(user: Utilisateur) {
    // TODO : clic sur "Ajouter" au niveau de la gestion du personnel
    this.router.navigateByUrl('parametrage/utilisateur/modifier/' + user.id + '#profils');
  }

  openUserModal() {
    this.userModalOpened = true;
  }

  closeUserModal() {
    this.userModalOpened = false;
  }

  public gotoUserDetails(url, user) {
    this.router.navigate([url, user.id]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }

  resetForm(formGroup: FormGroup) {
    formGroup.patchValue(this.franchise!);
    formGroup.markAsPristine();
}

  // convenience getter for easy access to form fields
  get f() { return this.franchiseForm.controls; }
  get fAssurance() { return this.assuranceForm.controls; }
  get fAdministration() { return this.administrationForm.controls; }
}
