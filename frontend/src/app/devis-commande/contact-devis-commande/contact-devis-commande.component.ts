import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuService} from '../../menu/menu.service';
import {DevisCommandeService} from '../devis-commande.service';
import {StatutCommandeService} from '../../resource/statut-commande/statut-commande.service';
import {DevisCommande} from '../DevisCommande';
import {EnumStatutCommande, EnumTypeContactDevisCommande} from '@aleaac/shared';
import {NotificationService} from '../../notification/notification.service';
import {TypeContactDevisCommande} from '../TypeContactDevisCommande';
import {ContactDevisCommande} from '../ContactDevisCommande';

@Component({
  selector: 'app-contact-devis-commande',
  templateUrl: './contact-devis-commande.component.html',
  styleUrls: ['./contact-devis-commande.component.scss']
})
export class ContactDevisCommandeComponent implements OnInit {
  devisCommande: DevisCommande;
  isDevis: boolean;
  enumTypeContactDevisCommande = EnumTypeContactDevisCommande
  typeContactDevisCommande: TypeContactDevisCommande | null;
  contactDevisCommande: ContactDevisCommande;
  modalClient: boolean = false;

  constructor(
      private route: ActivatedRoute,
      private menuService: MenuService,
      private devisCommandeService: DevisCommandeService,
      private statutCommandeService: StatutCommandeService,
      private router: Router,
      private notificationService: NotificationService
  ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.devisCommandeService.get(params.id).subscribe((devisCommande) => {
                    this.devisCommande = devisCommande;
                    console.log(this.devisCommande);
                    this.statutCommandeService.statutIsBeforeCommande(this.devisCommande.idStatutCommande).then(isDevis => {
                        this.isDevis = isDevis;
                        if (isDevis) {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Devis #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                                ['Contacts', '']
                            ]);
                        } else {
                            this.menuService.setMenu([
                                ['Devis & Commande', '/devis-commande'],
                                ['Commande #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                                ['Contacts', '']
                            ]);
                        }
                    });
                });
            } else {
                this.menuService.setMenu([
                    ['Devis & Commande', '/devis-commande'],
                    ['Contacts du devis', '']
                ]);
            }
        });
    }

    figeDevis() {
        if (!this.devisCommande.isModifie) {
            this.devisCommandeService.figer(this.devisCommande.id).subscribe((devisCommande) => {
                this.devisCommande.versionFigee = devisCommande.versionFigee;
            });
        }
    }

    confirmerCommande() {
        if (this.checkSiDetail()) {
            this.devisCommande.idStatutCommande = EnumStatutCommande.COMMANDE_EN_SAISIE;
            console.log(this.devisCommande);
            delete this.devisCommande.statut;
            this.devisCommande.versionFigee = true;
            this.isDevis = false;
            this.enregistrer();
        }
    }

    enregistrer() {
        this.devisCommandeService.update(this.devisCommande).subscribe(() => {
            this.router.navigate(['devis-commande']);
        });
    }

    checkSiDetail() {
        if (!this.devisCommande.devisCommandeDetails || this.devisCommande.devisCommandeDetails.length < 1) {
            this.notificationService.setNotification('danger', ['Vous devez avoir au moins une ligne de détail dans votre devis.']);
            return false;
        } else {
            return true;
        }
    }

    deleteInterlocuteur(contactDevisCommande) {
      this.devisCommandeService.deleteInterlocuteur(contactDevisCommande).subscribe(() => {
          this.devisCommande.contactDevisCommandes = this.devisCommande.contactDevisCommandes.filter((contact) =>{
              return contact.id !== contactDevisCommande.id;
          });
      });
    }

    openModalContact() {
      this.modalClient = true;
    }

    setContactDevisCommande(contactDevisCommande: ContactDevisCommande) {
        this.contactDevisCommande = contactDevisCommande;
        this.contactDevisCommande.devisCommande = this.devisCommande;
        this.contactDevisCommande.idDevisCommande = this.contactDevisCommande.devisCommande.id;
        this.contactDevisCommande.idContact = this.contactDevisCommande.contact.id;
        this.contactDevisCommande.idTypeContactDevisCommande = this.contactDevisCommande.typeContactDevisCommande.id;
        console.log(this.contactDevisCommande);
        this.devisCommandeService.addContact(this.contactDevisCommande).subscribe(() => {
            this.devisCommande.contactDevisCommandes.push(this.contactDevisCommande);
            this.modalClient = false;
        });
    }

    closeModalClient() {
      this.modalClient = false;
    }

}
