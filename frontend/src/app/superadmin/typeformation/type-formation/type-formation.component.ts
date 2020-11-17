import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeFormation } from './TypeFormation';
import { TypeFormationService } from '../type-formation.service';
import { NotificationService } from '../../../notification/notification.service';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { MenuService } from '../../../menu/menu.service';
import { EnumTypeFichierGroupe, TypeFormationDCompetence } from '@aleaac/shared';
import { ProduitService } from '../../../resource/produit/produit.service';
import { IDomaineCompetence } from '@aleaac/shared';
import { ConsommableService } from '../../../logistique/consommable.service';
import { TFormationDCompetenceService } from '../tFormation-dCompetence.service';
import { RessourceHumaineFormationService } from '../../../logistique/rh-formation.service';
import { FormationService } from '../../../formation/formation.service';
import { NoteCompetenceStagiaireService } from '../../../formation/note-competence-stagiaire.service';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';

@Component({
  selector: 'app-type-formation',
  templateUrl: './type-formation.component.html',
  styleUrls: ['./type-formation.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class TypeFormationComponent implements OnInit {
  @Input() modal: boolean = false;
  @Output() emitTypeFormation = new EventEmitter<TypeFormation>();

  typeFormation: TypeFormation | null;
  typeFormations: TypeFormation[];
  listTheorique: IDomaineCompetence[];
  listPratique: IDomaineCompetence[];

  openModalCreate: boolean = false;

  constructor(
    private typeFormationService: TypeFormationService,
    private notificationService: NotificationService,
    private menuService: MenuService,
    private produitService: ProduitService,
    private tFormationDCompetenceService: TFormationDCompetenceService,
    private ressourceHumaineFormationService: RessourceHumaineFormationService,
    private formationService: FormationService,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService
  ) { }

  queryBuild: QueryBuild = new QueryBuild();
  champDeRecherches: ChampDeRecherche[] = [
    new ChampDeRecherche('Formation', 'text', 'type-formation.nomFormation', true, true),
    new ChampDeRecherche('Produit', 'text', 'product.nom', true, true),
    new ChampDeRecherche('Durée en jour', 'text', 'type-formation.dureeEnJour', true, true)
];

  ngOnInit() {
    if(!this.modal){
      this.menuService.setMenu([
        ['Super admin', '/superadmin'],
        ['Types de formations', '']
      ]);
    }
   
    // this.typeFormationService.getAll().subscribe((typeFormations) => {
    //   this.typeFichiers = typeFichiers;
    // }, err => {
    //   this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
    //   console.error(err);
    // });
    this.getAllTypeFormation();



  }

  setQueryBuild(queryBuild){
    this.queryBuild = queryBuild;
    this.getAllTypeFormation();
  }

  getAllTypeFormation() {

    this.typeFormationService.getAllQueryBuild(this.queryBuild).subscribe((typeFormations) => {
      this.typeFormations = typeFormations;
      console.log(typeFormations);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.error(err);
    });

    // this.typeFormationService.getAll().subscribe((typeFormations) => {
    //   this.typeFormations = typeFormations;
    //   console.log(typeFormations);
    // }, err => {
    //   this.notificationService.setNotification('danger', ['Une erreur est survenue']);
    //   console.error(err);
    // });
  }

  //   ajoutTypeFichier() {
  //     this.typeFichier = new TypeFichier();
  //   }

  ajoutTypeFormation() {
    console.log('alolo');
    this.typeFormation = new TypeFormation();
    this.openModalCreate = true;
  }

  editTypeFormation(typeFormation) {

    if (this.modal) {
      console.log(typeFormation);
      this.emitTypeFormation.emit(typeFormation);
  } else {
    this.listPratique = [];
    this.listTheorique = [];
    this.typeFormationService.get(typeFormation.id).subscribe(t => {
      this.typeFormation = t;
      if (t.dCompetence!.length) {
        t.dCompetence!.forEach(type => {
          if (type.typePratique) {
            this.listPratique.push(type!.dCompetence!);
          } else {
            this.listTheorique.push(type!.dCompetence!);
          }
        });
      }
      this.openModalCreate = true;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }
    
    // this.typeFormation = typeFormation;


  }

  setTypeFormation(typeFormation1) {
    console.log('close type formation');
    this.typeFormation = null;
    this.openModalCreate = false;
    console.log(typeFormation1);


    if (typeFormation1) {
      if (typeFormation1.id) {
        console.log(typeFormation1);
        this.typeFormationService.update(typeFormation1).subscribe((newTypeFormation) => {
          typeFormation1 = newTypeFormation;
          this.getAllTypeFormation();
          this.notificationService.setNotification('success', ['Type de formation updated']);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      } else {
        console.log(typeFormation1);
        this.typeFormationService.add(typeFormation1).subscribe((newTypeFormation) => {
          this.notificationService.setNotification('success', ['Type formation ajouté correctement']);
          this.typeFormations.push(newTypeFormation);

          if (typeFormation1.listPratique.length) {
            for (let pra of typeFormation1.listPratique) {
              this.tFormationDCompetenceService.add({ 'idTypeFormation': newTypeFormation.id, 'idDCompetence': pra.id, 'typePratique': true }).subscribe(e => {
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
              })
            }
          }
          if (typeFormation1.listTheorique.length) {
            for (let theo of typeFormation1.listTheorique) {
              this.tFormationDCompetenceService.add({ 'idTypeFormation': newTypeFormation.id, 'idDCompetence': theo.id, 'typePratique': false }).subscribe(e => {
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
              });
            }
          }
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }
    }

    console.log(this.typeFormations);
  }

  supprimer(typeFormation: TypeFormation) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      delete typeFormation['formateur'];
      this.ressourceHumaineFormationService.deleteByIdFormation(typeFormation.id).subscribe(() => {

        this.noteCompetenceStagiaireService.deleteAllNoteByIdTypeFormation(typeFormation.id).subscribe(() => {

          this.tFormationDCompetenceService.deleteByIdFormation(typeFormation.id).subscribe(() => {

            this.formationService.getAll(this.queryBuild).subscribe(formaList => {
              if (formaList) {
                formaList.forEach(e => {
                  if (e.typeFormation) {
                    if (e.typeFormation.id == typeFormation.id) {
                      this.formationService.getTypeFormationNull(typeFormation.id).subscribe((ele1) => {
                      }, err => {
                        console.log('err2');
                        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                        console.log(err);
                      });
                    }
                  }

                });
                this.typeFormationService.delete(typeFormation.id).subscribe(dataSup => {

                  this.notificationService.setNotification('success', ['Formation supprimé']);
                  this.typeFormations = this.typeFormations!.filter(item => item.id !== typeFormation.id);
                }, err => {
                  console.log('err1');
                  this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                  console.log(err);
                });
              }else{
                this.typeFormationService.delete(typeFormation.id).subscribe(dataSup => {

                  this.notificationService.setNotification('success', ['Formation supprimé']);
                  this.typeFormations = this.typeFormations!.filter(item => item.id !== typeFormation.id);
                }, err => {
                  console.log('err1');
                  this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                  console.log(err);
                });
              }
              

            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
              console.log(err);
            });


          }, err => {
            console.log('err3');
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          });

        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });


      }, err => {
        console.log('err4');
        this.notificationService.setNotification('danger', ['Une erreur est survenue.'])
        console.log(err);
      });
    }
  }
}
