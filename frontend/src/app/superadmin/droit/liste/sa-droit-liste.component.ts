import { IDroit } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { DroitService } from '../../../resource/droit/droit.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import {Recherchable} from '../../../resource/query-builder/recherche/Recherchable';
import {ChampDeRecherche} from '../../../resource/query-builder/recherche/ChampDeRecherche';
import {Recherche} from '../../../resource/query-builder/recherche/Recherche';
import {Paginable} from '../../../resource/query-builder/pagination/Paginable';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {Order} from '../../../resource/query-builder/order/Order';

@Component({
    selector: 'sa-droit-liste',
    templateUrl: './sa-droit-liste.component.html',
    styleUrls: ['./sa-droit-liste.component.scss']
})
export class ListeDroitComponent implements OnInit, Recherchable, Paginable {

    constructor(private menuService: MenuService, private droitService: DroitService, private router: Router,
        private notificationService: NotificationService, private userService: UserService, private userStore: UserStore) {

        }
    droits: IDroit[] | null;

    nbObjets: number = 25;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Nom', 'text', 'droit.nom', true),
        new ChampDeRecherche('Code', 'text', 'droit.code', true),
        new ChampDeRecherche('Niveau', 'number', 'droit.niveau', true)
    ];
    headers: Order[] = [
        new Order('Nom', 'grow2', true, 'droit.nom'),
        new Order('Code', 'grow2', true, 'droit.code'),
        new Order('Niveau', 'grow1', true, 'droit.niveau'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();

    canCreateRight: Promise<boolean>;

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Droits', '']
        ]);
        this.userStore.user.subscribe(() => {
            this.canCreateRight = this.userStore.hasRight('RIGHTS_CREATE');
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.getDroits();
    }

    getDroits() {
        this.droitService.getPage(this.queryBuild).subscribe((data) => {
            this.droits = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countDroits() {
        this.droitService.countAll(this.queryBuild).subscribe((data2) => {
            this.nbObjets = data2;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countDroits();
        }
        this.getDroits();
    }

    supprimer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce droit ?')) {
            this.droitService.removeDroit(id).subscribe((data) => {
                    this.droits = this.droits!.filter(item => item.id !== id);
                    this.notificationService.setNotification('success', ['Droit supprimé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }

    public gotoDetails(url, user) {
        this.router.navigate([url, user.id]).then((e) => {
            if (e) {
                // console.log('Navigation is successful!');
            } else {
                // console.log('Navigation has failed!');
            }
        });
    }
}
