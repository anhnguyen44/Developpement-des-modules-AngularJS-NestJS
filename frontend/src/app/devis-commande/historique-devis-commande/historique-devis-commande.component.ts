import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {ActivatedRoute} from '@angular/router';
import {DevisCommandeService} from '../devis-commande.service';
import {DevisCommande} from '../DevisCommande';
import { NotificationService } from '../../notification/notification.service';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';

@Component({
  selector: 'app-historique-devis-commande',
  templateUrl: './historique-devis-commande.component.html',
  styleUrls: ['./historique-devis-commande.component.scss']
})
export class HistoriqueDevisCommandeComponent implements OnInit {
    devisCommande: DevisCommande;
    application: string = 'devis-commande';
    isDevis: boolean;

  constructor(
      private menuService: MenuService,
      private route: ActivatedRoute,
      private devisCommandeService: DevisCommandeService,
      private notificationService: NotificationService,
      private statutCommandeService: StatutCommandeService,
  ) { }

  ngOnInit() {
      this.route.params.subscribe((params) => {
          if (params.id) {
              this.devisCommandeService.get(params.id).subscribe((devisCommande) => {
                  this.devisCommande = devisCommande;

                  this.statutCommandeService.statutIsBeforeCommande(this.devisCommande.idStatutCommande).then(isDevis => {
                    this.isDevis = isDevis;
                    if (isDevis) {
                        this.menuService.setMenu([
                            ['Devis & Commande', '/devis-commande'],
                            ['Devis #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                            ['Historique', '']
                        ]);
                    } else {
                        this.menuService.setMenu([
                            ['Devis & Commande', '/devis-commande'],
                            ['Commande #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                            ['Historique', '']
                        ]);
                    }
                });
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
          }
      });
  }

}
