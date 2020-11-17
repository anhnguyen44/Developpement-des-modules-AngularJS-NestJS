import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TypeFichier } from '../type-fichier/TypeFichier';
import { NotificationService } from '../../../notification/notification.service';
import { TypeFichierGroupe, EnumTypeFichierGroupe } from '@aleaac/shared';
import { TypeFichierGroupeService } from '../type-fichier-groupe.service';

@Component({
  selector: 'app-modal-type-fichier',
  templateUrl: './modal-type-fichier.component.html',
  styleUrls: ['./modal-type-fichier.component.scss']
})
export class ModalTypeFichierComponent implements OnInit {
  @Input() typeFichier: TypeFichier;
  @Input() typeFichiers: TypeFichier[];
  @Output() emitTypeFichier = new EventEmitter<TypeFichier | null>();

  listeGroupes: TypeFichierGroupe[];

  constructor(
    private notificationService: NotificationService,
    private typeFichierGroupeService: TypeFichierGroupeService
  ) { }

  ngOnInit() {
    this.typeFichierGroupeService.getAll().subscribe(data => {
      this.listeGroupes = data;
    });
  }

  ajoutTypeFichier() {
    if (!this.typeFichier.nom || this.typeFichier.nom === '') {
      this.notificationService.setNotification('danger', ['Il faut un nom pour le type de fichier.']);
    } else if (this.typeFichiers.find((typeFile) => {
      return typeFile.nom === this.typeFichier.nom;
    }) && !this.typeFichier.id) {
      this.notificationService.setNotification('danger', ['Impossible d\'ajouter un nom de type de fichier qui existe déjà.']);
    } else {
      this.emitTypeFichier.emit(this.typeFichier);
    }
  }

  close() {
    this.emitTypeFichier.emit(null);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }

  compareFn(a, b) {
    // Handle compare logic (eg check if unique ids are the same)
    return a && b ? a == b || a.id == b.id || a.nom == b.nom : false;
  }

}
