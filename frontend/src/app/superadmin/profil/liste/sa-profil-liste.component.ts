import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../menu/menu.service';
import { UserService } from '../../../resource/user/user.service';
import { Router } from '@angular/router';
import { IProfil } from '@aleaac/shared';
import {NotificationService} from '../../../notification/notification.service';
import { ProfilService } from '../../../resource/profil/profil.service';
import { UserStore } from '../../../resource/user/user.store';
import {Recherchable} from '../../../resource/query-builder/recherche/Recherchable';
import {ChampDeRecherche} from '../../../resource/query-builder/recherche/ChampDeRecherche';
import {QueryBuild, QueryBuildable} from '../../../resource/query-builder/QueryBuild';
import {Paginable} from '../../../resource/query-builder/pagination/Paginable';
import {Order} from '../../../resource/query-builder/order/Order';

@Component({
    selector: 'sa-profil-liste',
    templateUrl: './sa-profil-liste.component.html',
    styleUrls: ['./sa-profil-liste.component.scss']
})
export class ListeProfilComponent implements OnInit, Recherchable, Paginable, QueryBuildable {

    constructor(private menuService: MenuService, private profilService: ProfilService, private router: Router,
        private notificationService: NotificationService, private userService: UserService, private userStore: UserStore) {
        }
    profils: IProfil[] | null;
    nbObjets: number = 25;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Nom', 'text', 'profil.nom', true)
    ];
    headers: Order[] = [
        new Order('Nom', 'grow2', true, 'profil.nom'),
        new Order('Visible Franchisé', 'grow1'),
        new Order('Droits', 'grow3'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();
    canCreateProfile: Promise<boolean>;

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Profils', '']
        ]);
        this.userStore.user.subscribe(() => {
            this.canCreateProfile = this.userStore.hasRight('PROFILES_CREATE');
          });
        this.getProfils();
    }

    getProfils() {
        this.profilService.getPage(this.queryBuild).subscribe((data) => {
            this.profils = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countProfils() {
        this.profilService.countAll(this.queryBuild).subscribe((data2) => {
            this.nbObjets = data2;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild =  queryBuild;
        if (this.queryBuild.needCount) {
            this.countProfils();
        }
        this.getProfils();
    }

    supprimer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet profil ?')) {
            this.profilService.removeProfil(id).subscribe((data) => {
                    this.profils = this.profils!.filter(item => item.id !== id);
                    this.notificationService.setNotification('success', ['Profil supprimé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    public gotoDetails(url, user) {
        this.router.navigate([url, user.id]).then((e) => {});
    }
}
