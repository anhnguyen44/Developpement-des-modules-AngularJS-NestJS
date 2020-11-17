import { IFranchise } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import {Recherchable} from '../../../resource/query-builder/recherche/Recherchable';
import {ChampDeRecherche} from '../../../resource/query-builder/recherche/ChampDeRecherche';
import {Recherche} from '../../../resource/query-builder/recherche/Recherche';
import {Paginable} from '../../../resource/query-builder/pagination/Paginable';
import {QueryBuild, QueryBuildable} from '../../../resource/query-builder/QueryBuild';

@Component({
    selector: 'sa-franchise-liste',
    templateUrl: './sa-franchise-liste.component.html',
    styleUrls: ['./sa-franchise-liste.component.scss']
})
export class ListeFranchiseComponent implements OnInit, Recherchable, Paginable, QueryBuildable {

    constructor(private menuService: MenuService, private franchiseService: FranchiseService, private router: Router,
        private notificationService: NotificationService, private userService: UserService, private userStore: UserStore) {

        }
    franchises: IFranchise[] | null;
    nbObjets: number = 25;

    canCreateFranchise: Promise<boolean>;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Raison sociale', 'text', 'franchise.raisonSociale', true, true),
        new ChampDeRecherche('Sortie réseau', 'checkbox', 'franchise.isSortieReseau', false, true),
    ];
    queryBuild: QueryBuild = new QueryBuild();


    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Franchises', '']
        ]);
        this.userStore.user.subscribe(() => {
            this.canCreateFranchise = this.userStore.hasRight('FRANCHISE_CREATE');
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.getFranchises();
        this.countFranchises();
    }

    getFranchises() {
        this.franchiseService.getPage(this.queryBuild).subscribe((data) => {
            this.franchises = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countFranchises() {
        this.franchiseService.countAll(this.queryBuild).subscribe((data2) => {
            this.nbObjets = data2;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countFranchises();
        }
        this.getFranchises();
    }

    supprimer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce franchise ?')) {
            this.franchiseService.removeFranchise(id).subscribe((data) => {
                    this.franchises = this.franchises!.filter(item => item.id !== id);
                    this.notificationService.setNotification('success', ['Franchise supprimé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
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
