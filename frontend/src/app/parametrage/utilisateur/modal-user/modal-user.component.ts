import {Component, EventEmitter, Input, Output, HostListener} from '@angular/core';
import { Utilisateur } from '@aleaac/shared';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent {
  @Input() opened: boolean;
  @Output() emitUtilisateur = new EventEmitter<Utilisateur>();
  @Output() emitClose = new EventEmitter<void>();

  constructor() {}

  setUtilisateur(utilisateur: Utilisateur) {
    this.emitUtilisateur.emit(utilisateur);
  }

  setState(opened: boolean) {
    this.opened = opened;
  }

  close() {
    this.emitClose.emit();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}
