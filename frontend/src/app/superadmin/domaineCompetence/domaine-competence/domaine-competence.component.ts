import { Component, OnInit } from '@angular/core';

import { NotificationService } from '../../../notification/notification.service';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { MenuService } from '../../../menu/menu.service';
import { DomaineCompetance } from './DomaineCompentence';
import { DomaineCompetenceService } from '../domaine-competence.service';
import { TFormationDCompetenceService } from '../../typeformation/tFormation-dCompetence.service';
import { TypeFormationDCompetence } from '@aleaac/shared';
import { NoteCompetenceStagiaireService } from '../../../formation/note-competence-stagiaire.service';

@Component({
  selector: 'app-domaine-competence',
  templateUrl: './domaine-competence.component.html',
  styleUrls: ['./domaine-competence.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class DomaineCompetenceComponent implements OnInit {
  domaineCompetence: DomaineCompetance | null;
  domaineCompetences: DomaineCompetance[];
  listTypeFormaDCompetence: TypeFormationDCompetence[];

  constructor(
    private menuService: MenuService,
    private doimaineCompetenceService: DomaineCompetenceService,
    private notificationService: NotificationService,
    private tFormationDCompetenceService: TFormationDCompetenceService,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService

  ) { }

  ngOnInit() {
    this.menuService.setMenu([
      ['Super admin', '/superadmin'],
      ['Domaine Competence', '']
    ]);

    this.doimaineCompetenceService.getAll().subscribe(data2 => {
      this.domaineCompetences = data2;
    }, err => {
      this.notificationService.setNotification("danger", ['Une erreur est survenue']);
      console.log(err);
    });

  }


  ajoutCompetence() {
    console.log('alolo');
    this.domaineCompetence = new DomaineCompetance();
  }

  edit(competence) {
    this.domaineCompetence = competence;
    console.log(competence.id);
  }

  setCompetence(competence) {
    console.log('this is set competence');
    this.domaineCompetence = null;
    console.log(competence);
    if (competence) {
      if (competence.id) {
        this.doimaineCompetenceService.update(competence).subscribe(data4 => {
          // this.domaineCompetences = this.domaineCompetences.filter(item=>item.id!==competence.id);
          // this.domaineCompetences.push(data4);
          this.notificationService.setNotification('success', ['Compétence est mis à jour']);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      } else {
        this.doimaineCompetenceService.add(competence).subscribe(data => {
          competence = data;
          this.notificationService.setNotification('success', ['Compétence created']);
          this.domaineCompetences.push(competence);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }
    }
  }

  supprimer(com: DomaineCompetance) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      this.tFormationDCompetenceService.getByIdCompetence(com.id).subscribe(listC=>{
        this.listTypeFormaDCompetence = listC;
        this.listTypeFormaDCompetence.forEach(e5=>{
          this.noteCompetenceStagiaireService.deleteByIdNote(e5.id).subscribe(()=>{
          },err=>{
            this.notificationService.setNotification('danger',['Une erreur est survenue']);
            console.log(err);
          });
        });
        this.tFormationDCompetenceService.deleteByIdCompetence(com.id).subscribe(() => {
          this.doimaineCompetenceService.delete(com.id).subscribe(dataSup => {
            this.notificationService.setNotification('success', ['Formation supprimé']);
            this.domaineCompetences = this.domaineCompetences!.filter(item => item.id !== com.id);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
          });
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.log(err);
        });
      },err=>{
        this.notificationService.setNotification('danger',['Une erreur est survenue']);
        console.log(err);
      });

      
    }
  }

}
