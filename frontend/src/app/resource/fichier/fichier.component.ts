import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FichierService } from './fichier.service';
import { Fichier } from './Fichier';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../notification/notification.service';
import { HistoriqueService } from '../historique/historique.service';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';
import { EnumTypeFichierGroupe } from '@aleaac/shared';

@Component({
  selector: 'app-fichier',
  templateUrl: './fichier.component.html',
  styleUrls: ['./fichier.component.scss']
})
export class FichierComponent implements OnInit {
  @Input() application: string;
  @Input() idParent: number;
  @Input() groupeTypeFicher: EnumTypeFichierGroupe;
  @Input() TypeFichier: TypeFichier;

  @Output() emitFichier: EventEmitter<Fichier> = new EventEmitter<Fichier>();
  @Output() emitDelete: EventEmitter<any> = new EventEmitter();
  modalAjouter: boolean = false;
  fichiers: Fichier[];

  constructor(
    private fichierService: FichierService,
    private notificationService: NotificationService,
    private historiqueService: HistoriqueService
  ) { }

  ngOnInit() {
    this.fichierService.getAll(this.application, this.idParent).subscribe((fichiers) => {
      this.fichiers = fichiers;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  openModal() {
    this.modalAjouter = true;
  }

  setFichier(fichier) {
    this.fichiers.unshift(fichier);
    this.emitFichier.emit(fichier);
    this.modalAjouter = false;
  }

  getFichier(fichier) {
    this.fichierService.get(fichier.keyDL).subscribe((file) => {
      const filename = fichier.nom + '.' + fichier.extention;
      FileSaver.saveAs(file, filename);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  updateComment(fichier) {
    this.fichierService.updateComment(fichier).subscribe((file) => {
    }, err => {
      this.notificationService.setNotification('warning', ['Le commentaire n\'a pas pu être mis à jour.']);
      console.error(err);
    });
  }

  deleteFichier(fichier) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      this.fichierService.delete(fichier).subscribe(() => {
        this.notificationService.setNotification('success', ['Fichier ' + fichier.nom + ' supprimé correctement.']);
        this.historiqueService.setHistorique(this.idParent, this.application, 'Suppression fichier : ' + fichier.nom);
        this.fichiers = this.fichiers.filter((file) => {
          return file.id !== fichier.id;
        });
        this.emitDelete.emit();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });
    }
  }
}
