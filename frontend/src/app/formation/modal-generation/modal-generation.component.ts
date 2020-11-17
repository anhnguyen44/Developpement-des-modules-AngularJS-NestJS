import {Component, EventEmitter, Input, OnInit, Output, HostListener} from '@angular/core';
import { FormationService } from '../formation.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import { NotificationService } from '../../notification/notification.service';
import * as FileSaver from 'file-saver';
import { Fichier } from '../../resource/fichier/Fichier';
import { FormationContact } from '@aleaac/shared';
import { FormationContactService } from '../formation-contact.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';

@Component({
  selector: 'app-modal-generation',
  templateUrl: './modal-generation.component.html',
  styleUrls: ['./modal-generation.component.scss']
})
export class ModalGenerationComponent implements OnInit {
  @Input() idSession: number;
  @Input() listStagiaireCoche: number[];
  @Input() listStagiaireChecked: FormationContact[];
  @Output() emitClose = new EventEmitter<boolean>();
  @Output() emitCloseModeCheckAll = new EventEmitter<boolean>();
  
  listFichiers:Fichier[];
  closed: boolean = false;

  constructor(
    private formationService: FormationService,
    private fichierService: FichierService,
    private notificationService: NotificationService,
    private formationContactService: FormationContactService
  ) { }

  ngOnInit() {
    
  }

  generateDocumentLingesCoches(text='demo'){
    console.log(this.listStagiaireChecked);
    this.formationService.generateDocumentCoche(text, this.listStagiaireChecked,this.idSession).subscribe(fichier=>{
      console.log(this.listStagiaireChecked);
      console.log(fichier);
      this.fichierService.get(fichier.keyDL).subscribe((file) => {
        const filename = fichier.nom + '.' + fichier.extention;
        FileSaver.saveAs(file, filename);
    }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
    },err=>{
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  generateFormationDocx(text: string){
    this.formationService.generateDocument(text, this.idSession).subscribe(fichier=>{
      console.log(fichier);
      this.fichierService.get(fichier.keyDL).subscribe((file) => {
        const filename = fichier.nom + '.' + fichier.extention;
        FileSaver.saveAs(file, filename);
    }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
    },err=>{
      this.notificationService.setNotification('danger',['Une erreur est survenue']);
      console.log(err);
    });
  }

  // generateDocumentParEntreprise(text: string){
  //   this.formationContactService.getAllByIdFormation(new QueryBuild(),this.idSession).subscribe
  // }

  close(){
    this.emitClose.emit(false);
    this.emitCloseModeCheckAll.emit(false);
  }
}
