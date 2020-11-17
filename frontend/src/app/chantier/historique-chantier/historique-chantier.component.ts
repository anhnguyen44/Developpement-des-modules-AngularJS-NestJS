import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { ChantierService } from '../chantier.service';
import { Chantier } from '../Chantier';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'app-historique-chantier',
    templateUrl: './historique-chantier.component.html',
    styleUrls: ['./historique-chantier.component.scss']
})
export class HistoriqueChantierComponent implements OnInit {
    chantier: Chantier;
    application: string = 'chantier';

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.chantierService.get(params.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + params.id + '/informations'],
                        ['Historique', '']
                    ]);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        });
    }

}
