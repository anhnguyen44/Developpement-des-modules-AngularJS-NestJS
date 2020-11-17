import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Intervention } from '../../intervention/Intervention';
import { Prelevement } from '../../processus/Prelevement';
import { ActivatedRoute } from '@angular/router';
import { PrelevementService } from '../../prelevement/prelevement.service';
import { MenuService } from '../../menu/menu.service';
import {ChantierService} from '../chantier.service';


@Component({
    selector: 'app-page-prelevement',
    templateUrl: './page-prelevement.component.html',
    styleUrls: ['./page-prelevement.component.scss']
})
export class PagePrelevementComponent implements OnInit {
    @Input() canEdit: boolean = true;
    @Output() emitRefresh: EventEmitter<void> = new EventEmitter();
    prelevement: Prelevement;
    idPrelevement: number;
    isNew: boolean = false;
    type: string = 'liste';
    idParent: number;
    application: string;
    redirectPath: (string | number)[];

    constructor(
        private route: ActivatedRoute,
        private prelevementService: PrelevementService,
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
                        ['Prélèvements', ''],
                    ]);
                })

                this.idParent = params.id;
                /*this.application = 'intervention.idChantier';*/
                this.application = 'chantier';
                this.redirectPath = ['chantier', params.id, 'prelevement'];
            }
            if (params.idPrelevement) {
                this.prelevementService.get(params.idPrelevement).subscribe((prelevement) => {
                    this.prelevement = prelevement;
                });
                this.idPrelevement = params.idPrelevement;
            }
        });
    }

    refreshParent() {
        this.emitRefresh.emit();
    }
}
