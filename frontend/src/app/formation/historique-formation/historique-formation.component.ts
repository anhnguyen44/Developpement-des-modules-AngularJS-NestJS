import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';

import { NotificationService } from '../../notification/notification.service';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';
import { Formation } from '@aleaac/shared';
import { FormationService } from '../formation.service';

@Component({
    selector: 'app-historique-formation',
    templateUrl: './historique-formation.component.html',
    styleUrls: ['./historique-formation.component.scss']
})
export class HistoriqueFormationComponent implements OnInit {
    formation: Formation;
    application: string = 'formation';
    isDevis: boolean;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private formationService: FormationService,
        private notificationService: NotificationService,
        private statutCommandeService: StatutCommandeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.formationService.getById(params.id).subscribe((forma) => {
                    console.log(forma);
                    this.formation = forma;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
                this.menuService.setMenu([
                    ['Session de formation', '/formation/liste'],
                    ['Formation #' + params.id, '/formation/' + params.id + '/modifier'],
                    ['Historique', '']
                ]);
            }
        });

        

    }

}
