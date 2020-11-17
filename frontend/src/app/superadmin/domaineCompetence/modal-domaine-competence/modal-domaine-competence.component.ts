import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { NotificationService } from '../../../notification/notification.service';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { MenuService } from '../../../menu/menu.service';
import { DomaineCompetance } from '../domaine-competence/DomaineCompentence';

@Component({
  selector: 'app-modal-domaine-competence',
  templateUrl: './modal-domaine-competence.component.html',
  styleUrls: ['./modal-domaine-competence.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class ModalDomaineCompetenceComponent implements OnInit {
  @Input() domaineCompetence: DomaineCompetance;
  @Input() domaineCompetences: DomaineCompetance[];
  @Output() emitCompetence = new EventEmitter<DomaineCompetance | null>();

  constructor(
    private menuService: MenuService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.menuService.setMenu([
      ['Super admin', '/superadmin'],
      ['Domaine Competence', '']
    ]);
}

close(){
  this.emitCompetence.emit(null);
}

ajoutCompetence(){
  console.log(this.domaineCompetence);
  if(!this.domaineCompetence.nom || this.domaineCompetence.nom ===''){
    this.notificationService.setNotification('danger',['Il faut un nom pour la compétence']);
  }else if(this.domaineCompetences.find((compe)=>{
    return compe.nom === this.domaineCompetence.nom;
  }) && !this.domaineCompetence.id){
    this.notificationService.setNotification('danger', ['Impossible d\'ajouter un nom de cette compétence qui existe déjà']);
  }else{
    console.log(this.domaineCompetence);
    this.emitCompetence.emit(this.domaineCompetence);  
  }
}
}

