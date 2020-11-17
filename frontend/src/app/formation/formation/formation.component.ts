import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import { Paginable } from '../../resource/query-builder/pagination/Paginable';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { MenuService } from '../../menu/menu.service';
import { FormationService } from '../formation.service';
import { NotificationService } from '../../notification/notification.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import * as FileSaver from 'file-saver';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../resource/validation/validation.service';
import { TypeFormationService } from '../../superadmin/typeformation/type-formation.service';
import { TypeFormation } from '../../superadmin/typeformation/type-formation/TypeFormation';
import { SalleService } from '../../logistique/salle.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Franchise, Formation, EnumStatutSessionFormation, IContact, IRessourceHumaine } from '@aleaac/shared';
import { RessourceHumaineFonctionService } from '../../logistique/rh-fonction.service';
import { Salle } from '../../logistique/Salle';
import { FonctionRH } from '../../logistique/FonctionRessourceHumaine';
import { format } from 'date-fns';
import { NoteCompetenceStagiaireService } from '../note-competence-stagiaire.service';
import { TFormationDCompetenceService } from '../../superadmin/typeformation/tFormation-dCompetence.service';
import { FormationContactService } from '../formation-contact.service';
import { Bureau } from '../../parametrage/bureau/Bureau';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { FormateurFormationService } from '../formateur-formation.service';
import { IFormateurFormation } from '@aleaac/shared';
import { FormationContact } from '@aleaac/shared';
import { elementStyleProp } from '@angular/core/src/render3';


@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit, Recherchable, Paginable {
  id: number;
  nbObjets: number = 20;
  submited: boolean = false;
  errorsFormation: string[] = new Array<string>();
  infoFormationForm = this.formBuilder.group({
    id: [null, null],
    typeFormation: ['', [Validators.required]],
    dateDebut: ['', null],
    nbrJour: ['', null],
    salle: ['', [Validators.required]],
    commentaire: ['', null],
    dateFin: [null, null],
    idStatutFormation: ['', null],
    bureau: ['', null],
    phrCertificat: ['', null],
    heureDebutForma: ['', null],
    heureFinForma: ['', null]
  });

  formateurForm = this.formBuilder.group({
    formateur: ['', [Validators.required]]
  });

  enumStatutSessionFormation = EnumStatutSessionFormation;

  listeTypeFormation: TypeFormation[];
  listeSalleFormation: Salle[];
  listeFormateur: FonctionRH[];
  franchise: Franchise;
  formationCreate: Formation;
  formationCreateTempo: Formation;
  compareFn = this._compareFn.bind(this);
  typeFormationOld: number;
  formationOld: TypeFormation;
  keys: any[];
  modalTypeFormation: boolean = false;
  listeBureau: Bureau[];
  submitedFormateur: boolean = false;
  errorsFormateur: string[] = new Array<string>();
  listeFormateurSubmit: IRessourceHumaine[] = [];
  listeFormateurFormation: IFormateurFormation[];

  constructor(
    private router: Router,
    private menuService: MenuService,
    private formationService: FormationService,
    private notificationService: NotificationService,
    private fichierService: FichierService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private typeFormationService: TypeFormationService,
    private salleService: SalleService,
    private franchiseService: FranchiseService,
    private rhFonctionSercive: RessourceHumaineFonctionService,
    private route: ActivatedRoute,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
    private tFormationDCompetenceService: TFormationDCompetenceService,
    private formationContactService: FormationContactService,
    private bureauxService: BureauService,
    private formateurFormationService: FormateurFormationService
  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id) {
      this.menuService.setMenu([
        ['Sessions', '/formation'],
        ['Session #' + this.id, ''],
      ]);
      this.formationService.getById(this.id).subscribe(ele => {
        if (ele.typeFormation) {
          this.typeFormationOld = ele.typeFormation.id;
          this.formationOld = ele.typeFormation;

          if (ele.typeFormation.dureeEnJour !== ele.nbrJour) {
            ele.nbrJour = ele.typeFormation.dureeEnJour;
            ele.dateFin = this.calculDataFinFormation(ele.dateDebut, ele.nbrJour);
            // console.log(ele.dateFin);
            delete ele['formateur'];
            delete ele['idTypeFormation'];
            delete ele['idSalle'];
            delete ele['idBureau'];

            this.formationService.update(ele).subscribe(forma2 => {

              this.formationService.getById(this.id).subscribe(ele2 => {
                this.formationCreate = ele2;
                this.formationCreate.formateur!.forEach(e => {
                  this.listeFormateurSubmit.push(e.formateur!);
                });
                // console.log(this.formationCreate);
                this.InitForms();
                if (this.formationCreate.dateDebut) {
                  this.infoFormationForm.patchValue({ dateDebut: format(this.formationCreate.dateDebut, 'YYYY-MM-DD') });
                }
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
              });

            }, err => {
              this.notificationService.setNotification("danger", ['Une erreur est survenue']);
              console.log(err);
            });
          } else {
            this.formationCreate = ele;
            this.formationCreate.formateur!.forEach(e => {
              this.listeFormateurSubmit.push(e.formateur!);
            });
            // console.log(this.formationCreate);
            this.InitForms();
            if (this.formationCreate.dateDebut) {
              this.infoFormationForm.patchValue({ dateDebut: format(this.formationCreate.dateDebut, 'YYYY-MM-DD') });
            }
          }
        } else {
          this.formationCreate = ele;
          this.formationCreate.formateur!.forEach(e => {
            this.listeFormateurSubmit.push(e.formateur!);
          });

          // console.log(this.formationCreate);
          this.InitForms();
          if (this.formationCreate.dateDebut) {
            this.infoFormationForm.patchValue({ dateDebut: format(this.formationCreate.dateDebut, 'YYYY-MM-DD') });
          }
        }

        if (ele.typeFormation) {
          this.getFormateur(ele.typeFormation.id, this.franchise.id);
        }
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    } else {
      this.menuService.setMenu([
        ['Sessions', '/formation'],
        ['Nouvelle session de formation', '/formation/ajouter'],
      ]);
    }
  }

  champDeRecherches: ChampDeRecherche[] = [
    // new ChampDeRecherche('Title', 'text', 'menu-defini.titre', true, true),

  ];

  queryBuild: QueryBuild = new QueryBuild();

  champsInfoFormation: Map<string, string> = new Map<string, string>([
    ['typeFormation', 'Le type de formation'],
    ['salle', 'La salle de formation'],
  ]);

  champsFormateurForm: Map<string, string> = new Map<string, string>([
    ['formateur', 'Le formateur'],
  ]);

  ngOnInit() {

    this.typeFormationService.getAll().subscribe(data1 => {
      this.listeTypeFormation = data1;
      // console.log(this.listeTypeFormation);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
    this.franchiseService.franchise.subscribe(franchise => {
      this.franchise = franchise;

      this.bureauxService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
        this.listeBureau = bureaux;
        bureaux = bureaux.filter(e => e.bPrincipal == 1);
        if (!this.id) {
          this.infoFormationForm.patchValue({
            bureau: bureaux[0]
          });
        }
        this.getSalles(this.franchise.id);

      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    });
    // this.rhFonctionSercive.getAllFormateur().subscribe(data3 => {
    //   console.log(data3);
    //   this.listeFormateur = data3;
    // }, err => {
    //   this.notificationService.setNotification('danger', ['Une erreur est survenue']);
    //   console.log(err);
    // });
    // console.log(this.enumStatutSessionFormation);
    this.keys = Object.keys(this.enumStatutSessionFormation).filter(Number);
  }

  getSalles(idFranchise:number){
    this.salleService.getAll(idFranchise, this.queryBuild).subscribe(data2 => {
      this.listeSalleFormation = data2;
      this.listeSalleFormation = this.listeSalleFormation.filter(e => e.idBureau == this.infoFormationForm.value['bureau'].id);
      // console.log(data2);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  setListSalles(){
    this.getSalles(this.franchise.id);
  }

  validateFormation() {
    this.submited = true;

    if (this.infoFormationForm.invalid) {
      this.errorsFormation = [];
      this.errorsFormation = this.validationService.getFormValidationErrors(this.infoFormationForm, this.champsInfoFormation);
      this.notificationService.setNotification('danger', this.errorsFormation);
      return false;
    } else {
      return true;
    }
  }

  validateFormateur() {
    this.submitedFormateur = true;
    this.errorsFormateur = [];

    if (this.listeFormateurSubmit) {
      if (this.listeFormateurSubmit.find((e) => {
        return e.id === this.formateurForm.value['formateur'].id;
      })) {
        this.formateurForm.controls['formateur'].setErrors({ 'alreadyExists': true });
      }
    }

    if (this.formateurForm.invalid) {
      this.errorsFormateur = this.validationService.getFormValidationErrors(this.formateurForm, this.champsFormateurForm);
      this.notificationService.setNotification('danger', this.errorsFormateur);
      return false;
    } else {
      return true;
    }
  }

  onSubmitFormateur(e) {
    if (!this.validateFormateur()) {
      return;
    }

    this.listeFormateurSubmit.push(e.value.formateur);
    // console.log(this.listeFormateurSubmit);
    if (this.id) {
      this.formateurFormationService.create({ 'idFormateur': e.value.formateur, 'idFormation': this.id }).subscribe(e2 => {
        this.notificationService.setNotification('success', ['Un formateur est ajouté']);
        this.formationService.getById(this.id).subscribe(forma => {
          // this.formationCreate = forma;
          // console.log(this.formationCreate);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    }

  }

  removeFormateur(formateurInfo) {
    this.listeFormateurSubmit = this.listeFormateurSubmit.filter(e => e.id != formateurInfo.id);
    // console.log(this.listeFormateurSubmit);
    if (this.id) {

      this.listeFormateurFormation = this.formationCreate.formateur!;
      // console.log(this.listeFormateurFormation);
      this.listeFormateurFormation = this.listeFormateurFormation.filter(e => e.formateur!.id === formateurInfo.id)

      if (this.listeFormateurFormation.length) {
        this.formateurFormationService.delete(this.listeFormateurFormation[0].id).subscribe(() => {
          this.notificationService.setNotification('success', ['Un formateur est supprimé']);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }
    }
  }

  onSubmit(info) {
    if (!this.validateFormation()) {
      return;
    }
    this.formationCreate = { ...this.formationCreate, ...info.value };
    this.calculDataFinFormation(this.formationCreate.dateDebut, this.formationCreate.nbrJour);
    this.formationCreate.idFranchise = this.franchise.id;
    this.formationCreate.typeFormation = this.formationCreateTempo.typeFormation;

    delete this.formationCreate['idBureau'];
    delete this.formationCreate['idTypeFormation'];
    delete this.formationCreate['idSalle'];

    // console.log(this.formationCreate);

    if (!this.id) {
      this.formationService.create(this.formationCreate).subscribe((data5) => {
        this.notificationService.setNotification('success', ['La session de formation created']);
        this.listeFormateurSubmit.forEach(e => {
          this.formateurFormationService.create({ 'idFormateur': e.id, 'idFormation': data5.id }).subscribe((f) => {
            this.notificationService.setNotification('success', ['Formation created']);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          });
        });
        this.router.navigate(['formation/', 'liste']);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    } else {
      // console.log(this.typeFormationOld);
      if (this.formationCreate.typeFormation.id !== this.typeFormationOld) {
        if (confirm('Si vous changez la type de formation. Tous des notes des stagiaire initialiseraient')) {
          // console.log('change typeformation');
          // console.log(this.id);
          this.typeFormationOld = this.formationCreate.typeFormation.id;
          this.noteCompetenceStagiaireService.deleteAllNoteByIdFormation(this.id).subscribe(() => {
            this.tFormationDCompetenceService.getByIdTypeFormation(this.formationCreate.typeFormation.id).subscribe(listCompetence => {
              // console.log(listCompetence);
              listCompetence.forEach(c => {
                this.formationContactService.getAllByIdFormation(this.queryBuild, this.id).subscribe(listStagiaire => {
                  // console.log(listStagiaire);
                  listStagiaire.forEach(s => {
                    this.noteCompetenceStagiaireService.create({ 'idStagiaire': s.id, 'idCompetence': c.id, 'note': 0 }).subscribe(n => {
                    }, err => {
                      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                      console.log(err);
                    });
                  });
                }, err => {
                  this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                  console.log(err);
                });
              });
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue']);
              console.log(err);
            });
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          })
        } else {
          this.formationCreate.typeFormation.id = this.typeFormationOld;
          this.infoFormationForm.patchValue({ typeFormation: this.formationOld.nomFormation + ' - ' + this.formationOld.phrFormation + ' - ' + this.formationOld.cateFormation });
        }
      }

      // console.log(this.typeFormationOld);

      delete this.formationCreate['formateur'];
      
      // console.log(this.formationCreate);
      console.log(this.formationCreate);
      this.formationService.update(this.formationCreate).subscribe((data6) => {
        this.notificationService.setNotification('success', ['La formation updated']);
        this.router.navigate(['formation/', 'liste']);
      }, err => {
        this.notificationService.setNotification('danger', ["Une erreur est survenue"]);
        console.log(err);
      });
    }

  }

  calculDataFinFormation(dateDebut: Date, duree: number) {
    let listDay = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
    let dateDebutTemp = new Date(dateDebut);
    let dateDebutRemplace = new Date(dateDebut);

    if (listDay[dateDebutTemp.getDay()] == 'Samedi') {
      dateDebutTemp.setDate(dateDebutTemp.getDate() + 2);
      this.formationCreate.dateDebut = new Date(dateDebutTemp);
      this.formationCreate.dateDebut.setDate(dateDebutTemp.getDate());
    } else if (listDay[dateDebutTemp.getDay()] == 'Dimanche') {
      // console.log('coucou');
      dateDebutTemp.setDate(dateDebutTemp.getDate() + 1);
      this.formationCreate.dateDebut = new Date(dateDebutTemp);
      this.formationCreate.dateDebut.setDate(dateDebutTemp.getDate());
    }

    let dateFinTemp = new Date(dateDebutTemp);
    for (var i = 1; i < duree; i++) {

      if (listDay[dateFinTemp.getDay() + 1] == 'Samedi') {
        dateFinTemp.setDate(dateFinTemp.getDate() + 3);
      } else {
        dateFinTemp.setDate(dateFinTemp.getDate() + 1);
      }
    }

    if (this.formationCreate) {
      this.formationCreate.dateFin = new Date(dateFinTemp);
      this.formationCreate.dateFin.setDate(dateFinTemp.getDate());
    }

    return dateFinTemp;
  }

  generateFormationDocx(text = 'demo') {

    this.formationService.generateDocument(text, this.id).subscribe(fichier => {
      // console.log(fichier);
      this.fichierService.get(fichier.keyDL).subscribe((file) => {
        const filename = fichier.nom + '.' + fichier.extention;
        FileSaver.saveAs(file, filename);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  setEvent() {
    const type = this.formationCreate.typeFormation.dureeEnJour;
    this.infoFormationForm.patchValue({ nbrJour: type });
    this.getFormateur(this.formationCreate.typeFormation.id, this.franchise.id);

  }

  getFormateur(idTypeForma: number, idFranchise: number) {
    // console.log(idFranchise);
    this.rhFonctionSercive.getFormateurByIdTypeFormationParFranchise(idTypeForma, idFranchise).subscribe(listData3 => {
      // console.log(listData3);
      this.listeFormateur = listData3;
      // if (!this.id) {
      //   if (this.listeFormateur.length == 1) {
      //     this.infoFormationForm.patchValue({ formateur: listData3[0].rh!.utilisateur });
      //   }
      // }
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });

    // this.rhFonctionSercive.getFormateurByIdTypeFormation(idTypeForma).subscribe(listData3 => {
    //   this.listeFormateur = listData3;
    //   if (!this.id) {
    //     if (this.listeFormateur.length == 1) {
    //       this.infoFormationForm.patchValue({ formateur: listData3[0].rh!.utilisateur });
    //     }
    //   }
    // }, err => {
    //   this.notificationService.setNotification('danger', ['Une erreur est survenue']);
    //   console.log(err);
    // });

  }

  openTypeFormation() {
    this.modalTypeFormation = true;
  }

  setQueryBuild(queryBuild) {
    this.queryBuild = queryBuild;
    // this.getAll();
  }

  setTypeFormation(e: TypeFormation) {
    this.formationCreate = { ...this.formationCreate, ...{ typeFormation: e } };
    this.formationCreateTempo = { ...this.formationCreateTempo, ...{ typeFormation: e } };
    this.infoFormationForm.patchValue({ typeFormation: e.nomFormation + ' - ' + e.phrFormation + ' - ' + e.cateFormation });
    this.modalTypeFormation = false;
    this.setEvent();
  }

  public gotoDetails(url, menu) {
    this.router.navigate([url, menu.id]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }

  private InitForms() {
    this.infoFormationForm.patchValue(this.formationCreate!);
    this.formationCreateTempo = this.formationCreate;
    this.infoFormationForm.patchValue({ typeFormation: this.formationCreate.typeFormation.nomFormation + ' - ' + this.formationCreate.typeFormation.phrFormation + ' - ' + this.formationCreate.typeFormation.cateFormation });
  }

  get f() {
    return this.infoFormationForm.controls;
  }

  _compareFn(a, b) {
    // Handle compare logic (eg check if unique ids are the same)
    return a && b ? a.id === b.id : false;
  }
}
