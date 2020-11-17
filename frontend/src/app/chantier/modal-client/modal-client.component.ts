import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import {fadeIn, fadeOut} from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-modal-client-chantier',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.scss']
})
export class ModalClientChantierComponent implements OnInit {
  @Input() modalClient: boolean = false;
  @Input() isOnlyContact: boolean = false;
  @Input() for: string = '';
  @Input() queryBuildContact: QueryBuild = new QueryBuild();
  @Output() emitClientWithTarif = new EventEmitter<Compte | Contact>();
  @Output() emitClose = new EventEmitter();
  modalCreate: boolean = false;

  constructor(
    private contactService: ContactService,
    private compteService: CompteService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

  }

  setClient(client) {
    if (client.nom) {
      this.contactService.getWithTarif(client.id).subscribe((contact) => {
        this.emitClientWithTarif.emit(contact);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
    }
    if (client.raisonSociale) {
      this.compteService.getWithTarif(client.id).subscribe((compte) => {
        this.emitClientWithTarif.emit(compte);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
    }
  }

  setNouveauContact(event) {
    this.modalCreate = true;
  }

  setContact(contact) {
    console.log(contact);
    this.emitClientWithTarif.emit(contact);
  }

  close(event: Event) {
    if (!event || !event.srcElement || (event.srcElement!.classList[0] !== 'link' && event.srcElement!.classList[0] !== 'button')) {
      this.emitClose.emit();
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.emitClose.emit();
  }
}
