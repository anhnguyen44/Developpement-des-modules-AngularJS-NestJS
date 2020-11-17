import { Component, Input, OnInit } from '@angular/core';
import { HistoriqueService } from './historique.service';
import { Historique } from './Historique';
import { Paginable } from '../query-builder/pagination/Paginable';
import { QueryBuild, QueryBuildable } from '../query-builder/QueryBuild';
import { Order } from '../query-builder/order/Order';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'app-historique',
    templateUrl: './historique.component.html',
    styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit, Paginable, QueryBuildable {
    historiques: Historique[];
    @Input() application: string;
    @Input() idParent: number;
    queryBuild = new QueryBuild();
    nbObjets: number;
    defaultOrder: Order = new Order('Date', 'grow1', true, 'historique.date', 'DESC');
    headers: Order[] = [
        new Order('Utilisateur', 'grow1'),
        new Order('Date', 'grow1', true, 'historique.date'),
        new Order('Description', 'grow3'),
    ];

    constructor(private historiqueService: HistoriqueService, private notificationService: NotificationService) { }

    ngOnInit() {
        this.historiqueService.countByApplication(this.application, this.idParent).subscribe((data) => {
            this.nbObjets = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.getByApplication();
    }

    getByApplication() {
        this.historiqueService.getByApplication(this.application, this.idParent, this.queryBuild).subscribe((data) => {
            this.historiques = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        this.getByApplication();
    }
}
