import {IGrilleTarif, TypeGrilles} from '@aleaac/shared';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { GrilleTarifService } from '../../../resource/grille-tarif/grille-tarif.service';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { Recherchable } from '../../../resource/query-builder/recherche/Recherchable';
import { Recherche } from '../../../resource/query-builder/recherche/Recherche';
import { LoginService } from '../../../resource/user/login.service';
import {Paginable} from '../../../resource/query-builder/pagination/Paginable';
import {QueryBuild, QueryBuildable} from '../../../resource/query-builder/QueryBuild';
import {Order} from '../../../resource/query-builder/order/Order';

@Component({
    selector: 'app-grille-tarif-liste',
    templateUrl: './tarif-liste.component.html',
    styleUrls: ['./tarif-liste.component.scss']
})
export class ListeGrilleTarifComponent implements OnInit, Recherchable, Paginable, QueryBuildable {

    @Input() isSuperAdmin: boolean;
    constructor(private menuService: MenuService, private grilleService: GrilleTarifService, private router: Router,
        private notificationService: NotificationService,
        private loginService: LoginService, private franchiseService: FranchiseService) {
        const isLoggedIn = this.loginService.loggedIn();
    }
    grillesTarif: IGrilleTarif[] | null;
    queryBuild: QueryBuild = new QueryBuild();
    nbObjets: number;
    idFranchise: number;
    enumTypeGrille = TypeGrilles;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Référence', 'text', 'grilleTarif.reference', true, true),
        new ChampDeRecherche('Conditions', 'text', 'grilleTarif.conditions', true, true),
        new ChampDeRecherche('Commentaire', 'text', 'grilleTarif.commentaire', true, true),
        new ChampDeRecherche('Type', 'enum', 'grilleTarif.idTypeGrille', false, true, this.enumTypeGrille)
    ];
    headers: Order[] = [
        new Order('Id', '', true, 'grilleTarif.id'),
        new Order('Référence', 'grow2', true, 'grilleTarif.reference'),
        new Order('Commentaire', 'grow3', true, 'grilleTarif.commentaire'),
        new Order('Action', 'action'),
    ];

    ngOnInit() {
        if (!this.isSuperAdmin) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Grilles tarif', '']
            ]);
        }

        this.franchiseService.franchise.subscribe(data => {
            this.idFranchise = data.id;
            this.getGrillesTarif();
            this.countGrillesTarif();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    getGrillesTarif() {
        this.notificationService.clearNotification();
        this.grilleService.getAll(this.idFranchise, this.queryBuild).subscribe((data) => {
            this.grillesTarif = data;
        }, (err) => {
            this.grillesTarif = [];
            this.notificationService.setNotification('danger',
                ['Une erreur est survenue. Il est possible que vous n\'ayez pas les droits suffisants sur la franchise sélectionnée.']);
        });
    }

    countGrillesTarif() {
        this.grilleService.countAll(this.idFranchise, this.queryBuild).subscribe((data) => {
            this.nbObjets = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countGrillesTarif();
        }
        this.getGrillesTarif();
    }

    supprimer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet grilleTarif ?')) {
            this.grilleService.removeGrilleTarif(id).subscribe((data) => {
                this.grillesTarif = this.grillesTarif!.filter(item => item.id !== id);
                this.notificationService.setNotification('success', ['GrilleTarif supprimée.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }

    public gotoDetails(url, grille) {
        const moduleToUse = this.isSuperAdmin ? 'superadmin' : 'parametrage';
        this.router.navigate([moduleToUse + url, grille.id]);
    }

    public clone(grille) {
        const newRef: string | null = prompt('Quelle référence souhaitez-vous donner à la nouvelle grille ? (modifiable par la suite)',
            grille.reference + ' - Copie');
        console.log(newRef);
        if (newRef && newRef !== '') {
            console.log('ok');
            this.grilleService.duplicate(grille.id, newRef).subscribe((data) => {
                const moduleToUse = this.isSuperAdmin ? 'superadmin' : 'parametrage';
                this.router.navigate([moduleToUse + '/grilleTarif/modifier/informations', data.id]);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }
}
