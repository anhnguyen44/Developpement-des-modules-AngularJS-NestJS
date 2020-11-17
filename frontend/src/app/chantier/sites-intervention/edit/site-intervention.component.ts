import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LatLngDto } from '@aleaac/shared/src/dto/chantier/latlng.dto';
import { LegendeDto } from '@aleaac/shared/src/dto/chantier/legende.dto';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { SitePrelevement, Franchise, CodePostal } from '@aleaac/shared';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { UserService } from '../../../resource/user/user.service';
import { SitePrelevementService } from '../../site-prelevement.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../resource/validation/validation.service';
import { TypeFichierService } from '../../../superadmin/typefichier/type-fichier.service';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { EnumTypeFichier } from '@aleaac/shared';
import { isThisQuarter } from 'date-fns';
import { Adresse } from '@aleaac/shared/src/models/adresse.model';

@Component({
    selector: 'app-site-intervention-edit',
    templateUrl: './site-intervention.component.html',
    styleUrls: ['./site-intervention.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class SiteInterventionEditComponent implements OnInit {
    @Input() siteInterv: SitePrelevement;
    @Output() emitClose: EventEmitter<void> = new EventEmitter();
    @Output() emitSite: EventEmitter<SitePrelevement> = new EventEmitter<SitePrelevement>();

    idChantier: number;
    id: number;
    franchise: Franchise;
    submitted: boolean = false;
    listePoints: LatLngDto[] = new Array<LatLngDto>();
    caption: LegendeDto[] = new Array<LegendeDto>();

    displayFichiers: boolean = false;
    displayBatiments: boolean = true;
    isSaving: boolean = false;
    isSavingAndClose: boolean = false;

    informationsForm: FormGroup;
    adresseForm: FormGroup;

    errorsInformations: string[] = new Array<string>();
    errorsAdresse: string[] = new Array<string>();
    typeFichierPjSite: TypeFichier;
    typeFichierPlanBatiment: TypeFichier;

    champsInformations: Map<string, string> = new Map<string, string>([
        ['civilite', 'La civilité'],
        ['nom', 'Le nom'],
        ['prenom', 'Le prénom'],
        ['raisonSociale', 'La raison sociale'],
        ['telephone', 'Le numéro de téléphone'],
        ['mobile', 'Le numéro de mobile'],
        ['fax', 'Le numéro de fax'],
        ['emailContact', 'L\'adresse mail de contact'],
        ['adresse', 'L\'adresse'],
        ['complementAdresse', 'Le complément d\'adresse'],
        ['ville', 'La ville'],
        ['codePostal', 'Le code postal'],
        ['franchisePrincipale', 'La franchise principale'],
        ['qualite', 'La qualité'],
        ['fonction', 'La fonction'],
    ]);

    champsAdresse: Map<string, string> = new Map<string, string>([
        ['adresse', 'L\'adresse'],
        ['complement', 'Le cmplément d\'adresse'],
        ['cp', 'Le code postal'],
        ['ville', 'La ville'],
        ['telephone', 'Le numéro de téléphone'],
        ['fax', 'Le numéro de fax'],
        ['email', 'L\'email'],
    ]);

    constructor(
        private route: ActivatedRoute,
        private sitePrelevementService: SitePrelevementService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private validationService: ValidationService,
        private formBuilder: FormBuilder,
        private typeFichierService: TypeFichierService,
    ) {
        this.adresseForm = this.formBuilder.group({
            id: [null, null],
            adresse: ['', Validators.required],
            complement: ['', null],
            cp: [, Validators.required],
            ville: [, Validators.required],
        });

        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            nom: ['', Validators.required],
            code: ['', null],
            accesHauteurNecessaire: ['', null],
            electriciteSurPlace: ['', null],
            combles: ['', null],
            digicode: ['', null],
            adresse: this.adresseForm,
            commentaire: ['', null],
            latitude: ['', null],
            longitude: ['', null],
        });
    }

    ngOnInit() {
        if (this.siteInterv) {
            this.id = this.siteInterv.id;
        } else {
            this.siteInterv = new SitePrelevement();
        }
        this.informationsForm.patchValue(this.siteInterv);
        setTimeout(() => {
            if (!this.siteInterv.adresse) {
                this.siteInterv.adresse = new Adresse();
            }

            this.adresseForm.patchValue(this.siteInterv.adresse);
        }, 1); // Ca marche pas sans le timeout, va savoir pourquoi
        this.route.params.subscribe((params) => {
            if (!this.siteInterv.idChantier) {
                this.siteInterv.idChantier = params.id;
            }
            this.idChantier = params.id;
        });

        this.typeFichierService.getAll().subscribe(data => {
            this.typeFichierPjSite = data.find(c => c.id == EnumTypeFichier.CHANTIER_PJ_SITE_PRELEVEMENT)!;
            this.typeFichierPlanBatiment = data.find(c => c.id == EnumTypeFichier.CHANTIER_PLAN_BATIMENT)!;
        });
    }

    onSubmit(closeAfterSave: boolean = false) {
        this.submitted = true;

        let doNotContinue = false;
        if (!this.validateAdresse()) {
            doNotContinue = true;
        }

        if (!this!.validateInformations()) {
            doNotContinue = true;
            this.validateAllFields(this.informationsForm);
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations.concat(this.errorsAdresse));
            return;
        }

        this.siteInterv = { ...this.siteInterv, ...this.informationsForm.value };
        this.siteInterv!.adresse = { ...this.adresseForm.value };

        if (closeAfterSave) {
            this.isSavingAndClose = true;
        } else {
            this.isSaving = true;
        }

        if (this.id) {
            this.siteInterv.id = this.id;
            this.sitePrelevementService.partialUpdate(this.siteInterv!).subscribe((data) => {
                this.siteInterv = { ...this.siteInterv, ...data };
                this.emitSite.emit(this.siteInterv);
                this.informationsForm.markAsPristine();
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
                if (closeAfterSave) {
                    this.isSavingAndClose = false;
                    this.emitClose.emit();
                } else {
                    this.isSaving = false;
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.sitePrelevementService.create(this.siteInterv!).subscribe((data) => {
                this.siteInterv.id = data.id;
                this.id = data.id;
                this.siteInterv.idAdresse = data.idAdresse;
                this.emitSite.emit(this.siteInterv);
                this.informationsForm.markAsPristine();
                this.notificationService.setNotification('success', ['Site de prélèvement créé.']);
                if (closeAfterSave) {
                    this.isSavingAndClose = false;
                    this.emitClose.emit();
                } else {
                    this.isSaving = false;
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    validateInformations() {
        this.errorsInformations = [];
        // stop here if form is invalid
        if (this.informationsForm.invalid) {
            this.errorsInformations = this.validationService.getFormValidationErrors(this.informationsForm, this.champsInformations);
            return false;
        } else {
            return true;
        }
    }

    validateAdresse() {
        // stop here if form is invalid
        this.errorsAdresse = [];
        if (this.adresseForm.invalid) {
            this.errorsAdresse = this.validationService.getFormValidationErrors(this.adresseForm, this.champsAdresse);
            return false;
        } else {
            return true;
        }
    }

    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
