import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { DevisCommande } from '../../devis-commande/DevisCommande';

@Component({
  selector: 'app-modal-devis-commande-chantier',
  templateUrl: './modal-devis-commande.component.html',
  styleUrls: ['./modal-devis-commande.component.scss']
})
export class ModalDevisCommandeChantierComponent implements OnInit {
  @Input() modalDevisCommande: boolean = false;
  @Output() emitDevisCommande = new EventEmitter<DevisCommande>();
  @Output() emitClose = new EventEmitter();

  constructor(
    private contactService: ContactService,
    private compteService: CompteService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

  }

  setDevisCommande(devisCommande: DevisCommande) {
        this.emitDevisCommande.emit(devisCommande);
  }

  setContact(contact) {
    console.log(contact);
    this.emitDevisCommande.emit(contact);
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
