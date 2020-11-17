import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import { Paginable } from '../../resource/query-builder/pagination/Paginable';
import { Utilisateur, IUtilisateur } from '@aleaac/shared';
import { MenuService } from '../../menu/menu.service';
import { UserService } from '../../resource/user/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification/notification.service';
import { UserStore } from '../../resource/user/user.store';
import { LoginService } from '../../resource/user/login.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';


@Component({
    selector: 'app-utilisateur-liste-chantier',
    templateUrl: './utilisateur-liste.component.html',
    styleUrls: ['./utilisateur-liste.component.scss']
})
export class ListeUtilisateurChantierComponent implements OnInit, Recherchable, Paginable {

    @Input() isSuperAdmin: boolean;
    @Input() isModal: boolean = false;
    @Output() emitUtilisateur = new EventEmitter<Utilisateur>();
    constructor(private menuService: MenuService, private userService: UserService, private router: Router,
        private notificationService: NotificationService, private userStore: UserStore,
        private loginService: LoginService, private franchiseService: FranchiseService) {
        const isLoggedIn = this.loginService.loggedIn();
    }
    utilisateurs: IUtilisateur[] | null;
    nbObjets: number = 25;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Nom', 'text', 'utilisateur.nom', true, true),
        new ChampDeRecherche('Prénom', 'text', 'utilisateur.prenom', true, true),
        new ChampDeRecherche('Email', 'text', 'utilisateur.login', true, true),
        new ChampDeRecherche('Suspendu', 'checkbox', 'utilisateur.isSuspendu', false, true),
    ];
    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Nom', '', true, 'utilisateur.nom'),
        new Order('Prénom', '', true, 'utilisateur.prenom'),
        new Order('Email', 'grow3', true, 'utilisateur.login'),
        new Order('Profil(s)'),
        new Order('Action', 'action'),
    ];

    ngOnInit() {
        if (!this.isSuperAdmin) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Utilisateurs', '']
            ]);
        }
        this.getUsers();
        this.countUsers();
    }

    getUsers() {
        this.userService.getPage(this.queryBuild).subscribe((data) => {
            this.utilisateurs = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countUsers() {
        this.userService.countAll(this.queryBuild).subscribe((data) => {
            this.nbObjets = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countUsers();
        }
        this.getUsers();
    }

    supprimer(user: Utilisateur) {
        if (confirm('Êtes-vous sûr de vouloir ' + (user.isSuspendu ? 'réactiver' : 'suspendre') + ' cet utilisateur ?')) {
            this.userService.removeUser(user.id).subscribe((data) => {
                this.notificationService.setNotification('success', ['Utilisateur ' + (user.isSuspendu ? 'réactivé' : 'suspendu') + '.']);
                this.ngOnInit();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }

    impersonate(user: Utilisateur) {
        this.loginService.impersonate(user.login, '');
    }

    public gotoDetails(url, user) {
        const moduleToUse = this.isSuperAdmin ? 'superadmin' : 'parametrage';
        this.router.navigate([moduleToUse + url, user.id]);
    }

    emitUser(user: Utilisateur) {
        this.emitUtilisateur.emit(user);
    }
}
