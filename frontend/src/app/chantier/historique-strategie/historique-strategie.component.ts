import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../notification/notification.service';
import { Strategie } from '@aleaac/shared';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';

@Component({
    selector: 'app-historique-strategie',
    templateUrl: './historique-strategie.component.html',
    styleUrls: ['./historique-strategie.component.scss']
})
export class HistoriqueStrategieComponent implements OnInit {
    strategie: Strategie;
    chantier: Chantier;
    application: string = 'strategie';

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private strategieService: StrategieService,
        private chantierService: ChantierService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.idStrategie) {
                this.strategieService.getStrategieById(params.idStrategie).subscribe((strategie) => {
                    this.strategie = strategie;
                });
            }
            if (params.id) {
                this.chantierService.get(params.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.chantier.id + '/informations'],
                        ['Stratégies (V ' + chantier.versionStrategie + ')', '/chantier/' + this.chantier.id + '/strategie/liste'],
                        ['Historique', ''],
                    ]);
                });
            }
        });
    }

}
