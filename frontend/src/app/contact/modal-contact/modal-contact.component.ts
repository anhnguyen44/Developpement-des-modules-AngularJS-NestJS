import {Component, ElementRef, EventEmitter, Input, Output, HostListener} from '@angular/core';
import { Contact } from '../../contact/Contact';
import { Compte } from '../../contact/Compte';

@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.component.html',
  styleUrls: ['./modal-contact.component.scss']
})
export class ModalContactComponent {
  @Input() type: string;
  @Input() compte: Compte;
  @Input() idCompte: number;
  @Input() nonAttache: boolean = false;
  @Output() emitContact = new EventEmitter<Contact>();
  @Output() emitCompte = new EventEmitter<Compte>();
  @Output() emitClose = new EventEmitter();

  constructor(private elmRef: ElementRef) {}

  setCompte(compte: Compte) {
    this.emitCompte.emit(compte);
  }

  setContact(contact: Contact) {
    this.emitContact.emit(contact);
  }

  setNouveau() {
    this.type = 'contact';
  }

  close() {
      this.emitClose.emit();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}
