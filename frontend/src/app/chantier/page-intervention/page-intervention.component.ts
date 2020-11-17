import { Component, OnInit } from '@angular/core';
import {Intervention} from '../../intervention/Intervention';
import {ActivatedRoute} from '@angular/router';
import {InterventionService} from '../../intervention/intervention.service';
import { MenuService } from '../../menu/menu.service';
import {ChantierService} from '../chantier.service';

@Component({
  selector: 'app-page-intervention',
  templateUrl: './page-intervention.component.html',
  styleUrls: ['./page-intervention.component.scss']
})
export class PageInterventionComponent implements OnInit {

    type: string = 'liste';
    idIntervention: number;
    intervention: Intervention;
    isNew: boolean = false;
    idParent: number;
    application: string;
    redirectPath: string | number [];

    constructor(
        private route: ActivatedRoute,
        private interventionService: InterventionService,
        private menuService: MenuService,
        private chantierService: ChantierService
    ) { }

    ngOnInit() {
        if (this.route.snapshot.url.length === 0) {
            this.type = 'liste';
        } else {
            if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path !== 'ajouter') {
                this.type = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                this.isNew = false;
            } else {
                this.type = 'information';
                this.isNew = true;
            }
        }

        this.route.params.subscribe((params) => {
            if (params.id) {
                this.chantierService.get(params.id).subscribe((chantier) => {
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier/liste'],
                        ['Chantier - ' + chantier.nomChantier, '/chantier/' + params.id + '/informations'],
                        ['Interventions', ''],
                    ]);
                })

                this.idParent = params.id;
                /*this.application = 'intervention.idChantier';*/
                this.application = 'chantier';
                this.redirectPath = ['chantier', params.id, 'intervention'];
            }
            if (params.idIntervention) {
                this.interventionService.get(params.idIntervention).subscribe((intervention) => {
                    this.intervention = intervention;
                });
                this.idIntervention = params.idIntervention;
            }
        });
    }

}
