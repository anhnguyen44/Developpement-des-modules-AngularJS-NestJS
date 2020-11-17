import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { Chantier } from '../../chantier/Chantier';

@Component({
  selector: 'app-modal-liste-chantier',
  templateUrl: './modal-liste-chantier.component.html',
  styleUrls: ['./modal-liste-chantier.component.scss']
})
export class ModalListeChantierComponent implements OnInit {
  @Input() modalChantier: boolean = false;
  @Output() emitChantier = new EventEmitter<Chantier>();
  @Output() emitClose = new EventEmitter();

  constructor(
    private contactService: ContactService,
    private compteService: CompteService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

  }

  setChantier(chantier: Chantier) {
        this.emitChantier.emit(chantier);
  }

  setContact(contact) {
    console.log(contact);
    this.emitChantier.emit(contact);
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
