import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {ActivatedRoute} from '@angular/router';
import {DevisCommandeService} from '../devis-commande.service';
import {DevisCommande} from '../DevisCommande';
import {fadeIn, fadeOut} from '../../resource/animation';
import { NotificationService } from '../../notification/notification.service';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';
import { EnumTypeFichierGroupe } from '@aleaac/shared';

@Component({
  selector: 'app-fichier-devis-commande',
  templateUrl: './fichier-devis-commande.component.html',
  styleUrls: ['./fichier-devis-commande.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class FichierDevisCommandeComponent implements OnInit {
  devisCommande: DevisCommande;
  application: string = 'devis-commande';
  isDevis: boolean;
  groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.DEVIS;

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
                            ['Fichiers', '']
                        ]);
                    } else {
                        this.menuService.setMenu([
                            ['Devis & Commande', '/devis-commande'],
                            ['Commande #' + params.id, '/devis-commande/' + params.id + '/modifier'],
                            ['Fichiers', '']
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
