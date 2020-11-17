import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TypeFormation } from '../type-formation/TypeFormation';
import { NotificationService } from '../../../notification/notification.service';
import { Produit, IDomaineCompetence, TypeFormationDCompetence } from '@aleaac/shared';
import { ProduitService } from '../../../resource/menu/menu.service';
import { DomaineCompetenceService } from '../../domaineCompetence/domaine-competence.service';
import { FormBuilder } from '@angular/forms';
import { TFormationDCompetenceService } from '../tFormation-dCompetence.service';
import { NoteCompetenceStagiaireService } from '../../../formation/note-competence-stagiaire.service';
import { FormationContactService } from '../../../formation/formation-contact.service';

@Component({
  selector: 'app-modal-type-formation',
  templateUrl: './modal-type-formation.component.html',
  styleUrls: ['./modal-type-formation.component.scss']
})
export class ModalTypeFormationComponent implements OnInit {
  @Input() typeFormation: TypeFormation;
  @Input() typeFormations: TypeFormation[];
  @Input() listPratique: IDomaineCompetence[];
  @Input() listTheorique: IDomaineCompetence[];
  @Input() modalListeTypeFormation: boolean;
  @Output() emitTypeFormation = new EventEmitter<TypeFormation | null>();
  @Output() emitClose = new EventEmitter<boolean>();


  listProductFormation: Produit[];
  listCompetences: IDomaineCompetence[];
  listCompetenceTheorique: IDomaineCompetence[] = [];
  listCompetencePratique: IDomaineCompetence[] = [];


  constructor(
    private notificationService: NotificationService,
    private produitService: ProduitService,
    private domaineCompetenceService: DomaineCompetenceService,
    private formBuilder: FormBuilder,
    private tFormationDCompetenceService: TFormationDCompetenceService,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
    private formationContactService: FormationContactService
  ) {

  }

  competenceForm = this.formBuilder.group({
    dCPratique: [null, null],
    dCTheorique: [null, null]
  });

  ngOnInit() {
    console.log(this.listPratique);
    console.log(this.listTheorique);
    console.log(this.typeFormations);
    console.log('Entrer le model type formation');
    this.produitService.getProduitsTypeFormation().subscribe(list => {
      this.listProductFormation = list;
      console.log(list);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });

    this.domaineCompetenceService.getAll().subscribe(data2 => {
      this.listCompetences = data2;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });

    if (this.typeFormation.id) {
      this.listCompetencePratique = this.listPratique;
      this.listCompetenceTheorique = this.listTheorique;
    }
  }

  ajoutTypeFormation() {
    console.log(this.typeFormation);
    console.log(this.typeFormations);
    if (!this.typeFormation.nomFormation || this.typeFormation.nomFormation === '') {
      this.notificationService.setNotification('danger', ['Il faut un nom pour le type de formation']);
    } else if (this.typeFormations.find((typeFile) => {
      return typeFile.nomFormation === this.typeFormation.nomFormation;
    }) && !this.typeFormation.id) {
      this.notificationService.setNotification('danger', ['Impossible d\'ajouter un nom de type de fichier qui existe déjà']);
    } else {
      if (!this.typeFormation.id) {
        this.typeFormation!.listPratique = this.listCompetencePratique;
        this.typeFormation!.listTheorique = this.listCompetenceTheorique;
        this.emitTypeFormation.emit(this.typeFormation);
      } else {
        console.log(this.typeFormation);
        // this.typeFormation.dCompetence = [];
        // this.typeFormation!.listPratique = [];
        // this.typeFormation!.listTheorique = [];
        this.emitTypeFormation.emit(this.typeFormation);
      }


    }
  }

  compePraSubmit() {
    this.competenceForm.patchValue({ 'dCTheorique': null });
  }

  compeTheoSubmit() {
    this.competenceForm.patchValue({ 'dCPratique': null });
  }

  supprimerPra(com) {
    console.log(com);
    this.listCompetencePratique = this.listCompetencePratique.filter(item => item.id !== com.id);
    console.log(this.typeFormation);
    if (this.typeFormation.dCompetence) {
      this.typeFormation.dCompetence!.forEach(typeForma => {
        if (typeForma.typePratique) {
          console.log(typeForma);
          if (typeForma.idDCompetence == com.id) {
            console.log(typeForma.id);
            this.noteCompetenceStagiaireService.deleteByIdCompetence(typeForma.id).subscribe(() => {
              this.tFormationDCompetenceService.delete(typeForma.id).subscribe(() => {
                this.notificationService.setNotification('success', ['Compétence pratique est supprimé']);
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
      });
    }

  }

  supprimerTheo(com) {
    this.listCompetenceTheorique = this.listCompetenceTheorique.filter(item => item.id !== com.id);
    if (this.typeFormation.dCompetence) {
      this.typeFormation.dCompetence!.forEach(typeForma => {
        if (!typeForma.typePratique) {
          if (typeForma.idDCompetence == com.id) {
            this.noteCompetenceStagiaireService.deleteByIdCompetence(typeForma.id).subscribe(() => {
              this.tFormationDCompetenceService.delete(typeForma.id).subscribe(() => {
                this.notificationService.setNotification('success', ['Compétence pratique est supprimé']);
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
      });
    }
  }

  submitCompetence() {
    let compePra = this.competenceForm.value['dCPratique'];
    let compeThe = this.competenceForm.value['dCTheorique'];


    if (compePra && compePra !== 'null') {
      if (this.listCompetencePratique.length) {
        console.log(this.listCompetencePratique);
        if (this.listCompetencePratique.find(competence => {
          return competence.id === compePra.id!
        })) {
          this.notificationService.setNotification("danger", ["Impossible d\'ajouter un competence qui existe déja"]);
        } else {
          this.listCompetencePratique.push(compePra);
          if (this.typeFormation.id) {
            this.tFormationDCompetenceService.add({ 'idTypeFormation': this.typeFormation.id, 'idDCompetence': compePra.id, 'typePratique': true }).subscribe(e => {
              this.typeFormation.dCompetence!.push(e);
              this.notificationService.setNotification('success', ['Compétence pratique est créé']);
              this.formationContactService.getAllByIdTypeFormation(this.typeFormation.id).subscribe(listStagiaire => {
                console.log(listStagiaire);
                listStagiaire.forEach(st => {
                  this.noteCompetenceStagiaireService.create({ 'idStagiaire': st.id, 'idCompetence': e.id, 'note': 0 }).subscribe(n => {
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
          }
        }
      } else {
        this.listCompetencePratique.push(compePra);
        if (this.typeFormation.id) {
          this.tFormationDCompetenceService.add({ 'idTypeFormation': this.typeFormation.id, 'idDCompetence': compePra.id, 'typePratique': true }).subscribe(e => {
            this.formationContactService.getAllByIdTypeFormation(this.typeFormation.id).subscribe(listStagiaire2 => {
              listStagiaire2.forEach(st2 => {
                this.noteCompetenceStagiaireService.create({ 'idStagiaire': st2.id, 'idCompetence': e.id, 'note': 0 }).subscribe(n => {
                }, err => {
                  this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                  console.log(err);
                });
              });
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue']);
              console.log(err);
            });
            this.typeFormation.dCompetence!.push(e);
            this.notificationService.setNotification('success', ['Compétence pratique est créé']);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          })
        }
      }
    }

    if (compeThe && compeThe !== 'null') {
      if (this.listCompetenceTheorique.length) {
        if (this.listCompetenceTheorique.find(competence => {
          return competence.id === compeThe.id!
        })) {
          this.notificationService.setNotification("danger", ["Impossible d\'ajouter un competence qui existe déja"]);
        } else {
          this.listCompetenceTheorique.push(compeThe);
          if (this.typeFormation.id) {
            this.tFormationDCompetenceService.add({ 'idTypeFormation': this.typeFormation.id, 'idDCompetence': compeThe.id, 'typePratique': false }).subscribe(e => {

              this.formationContactService.getAllByIdTypeFormation(this.typeFormation.id).subscribe(listStagiaire3 => {
                listStagiaire3.forEach(st3 => {
                  this.noteCompetenceStagiaireService.create({ 'idStagiaire': st3.id, 'idCompetence': e.id, 'note': 0 }).subscribe(n => {
                  }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                    console.log(err);
                  });
                });
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
              });

              this.typeFormation.dCompetence!.push(e);
              this.notificationService.setNotification('success', ['Compétence théorique est créé']);
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue']);
              console.log(err);
            });
          }
        }
      } else {
        this.listCompetenceTheorique.push(compeThe);
        if (this.typeFormation.id) {
          this.tFormationDCompetenceService.add({ 'idTypeFormation': this.typeFormation.id, 'idDCompetence': compeThe.id, 'typePratique': false }).subscribe(e => {

            this.formationContactService.getAllByIdTypeFormation(this.typeFormation.id).subscribe(listStagiaire4 => {
              listStagiaire4.forEach(st4 => {
                this.noteCompetenceStagiaireService.create({ 'idStagiaire': st4.id, 'idCompetence': e.id, 'note': 0 }).subscribe(n => {
                }, err => {
                  this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                  console.log(err);
                });
              });
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue']);
              console.log(err);
            });

            this.typeFormation.dCompetence!.push(e);
            this.notificationService.setNotification('success', ['Compétence théorique est créé']);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          });
        }
      }
    }

    console.log(compePra);
    console.log(compeThe);

    this.competenceForm.patchValue({ 'dCPratique': null });
    this.competenceForm.patchValue({ 'dCTheorique': null });

    console.log(this.listCompetencePratique);
    console.log(this.listCompetenceTheorique);
  }

  close() {
    this.emitTypeFormation.emit(null);
    this.emitClose.emit(false);
  }

  // @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   this.close();
  // }

  compareFn(a, b) {
    // Handle compare logic (eg check if unique ids are the same)
    return a && b ? a == b || a.id == b.id || a.nom == b.nom : false;
  }

}
