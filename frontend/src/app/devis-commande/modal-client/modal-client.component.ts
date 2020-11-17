import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { TypeContactDevisCommande } from '../TypeContactDevisCommande';
import { DevisCommandeService } from '../devis-commande.service';
import { ContactDevisCommande } from '../ContactDevisCommande';
import { NotificationService } from '../../notification/notification.service';
import { TypeContactDevisCommandeService } from '../type-contact-devis-commande.service';
import { EnumTypeContactDevisCommande } from '@aleaac/shared';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.scss']
})
export class ModalClientComponent implements OnInit {
  @Input() modalClient: boolean = false;
  @Input() for: string = '';
  @Input() choixDuType = true;
  @Input() isContactSeul = false;
  contactDevisCommande: ContactDevisCommande;
  newTypeContactDevisCommande: TypeContactDevisCommande;
  @Output() emitClientWithTarif = new EventEmitter<Compte | Contact>();
  @Output() emitContactDevisCommande = new EventEmitter<ContactDevisCommande>();
  @Output() emitClose = new EventEmitter();
  isExterne: boolean = false;
  modalContact: boolean = false;
  typeContactExterne: TypeContactDevisCommande[];
  typeContactInterne: TypeContactDevisCommande[];
  enumTypeContactDevisCommande = EnumTypeContactDevisCommande;

  constructor(
    private contactService: ContactService,
    private compteService: CompteService,
    private eRef: ElementRef,
    private devisCommandeService: DevisCommandeService,
    private notificationService: NotificationService,
    private typeContactDevisCommandeService: TypeContactDevisCommandeService
  ) { }

  ngOnInit() {
    this.typeContactDevisCommandeService.getAll().subscribe((typeContactDevisCommandes) => {
      this.typeContactExterne = typeContactDevisCommandes.filter((typeContact) => {
        return !typeContact.isInterne && typeContact.id !== this.enumTypeContactDevisCommande.CLIENT;
      });
      this.typeContactInterne = typeContactDevisCommandes.filter((typeContact) => {
        return typeContact.isInterne && typeContact.id !== this.enumTypeContactDevisCommande.CLIENT;
      });
    });
  }

  setClient(client) {
    console.log(client);
    if (client.nom) {
      if (!this.choixDuType) {
          this.contactService.getWithTarif(client.id).subscribe((contact) => {
              console.log(contact);
              this.emitClientWithTarif.emit(contact);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
          });
      } else {
        if (this.newTypeContactDevisCommande && this.choixDuType) {
            this.contactDevisCommande = new ContactDevisCommande();
            this.contactDevisCommande.contact = client;
            this.contactDevisCommande.typeContactDevisCommande = this.newTypeContactDevisCommande;
            this.emitContactDevisCommande.emit(this.contactDevisCommande);
        } else {
          this.notificationService.setNotification('danger', ['Vous devez saisir un type pour votre contact.']);
        }

      }
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

  setNouveauContact() {
    this.modalContact = true;
  }

  close(event) {
    if (!event || !event.srcElement || event.srcElement!.classList[0] !== 'button') {
      this.emitClose.emit();
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close(event);
  }
}
