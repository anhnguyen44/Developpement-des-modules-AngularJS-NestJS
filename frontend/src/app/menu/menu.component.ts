import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Input} from '@angular/core';
import {UserStore} from '../resource/user/user.store';
import {LoginService} from '../resource/user/login.service';
import {UserService} from '../resource/user/user.service';
import {Observable, of} from 'rxjs';
import {anyTrue} from '../resource/helper';
import {profils} from '@aleaac/shared/src/models/profil.model';
import {NotificationService} from '../notification/notification.service';
import {MenuDefini, ContenuMenu} from '@aleaac/shared';
import {MenuService} from './menu.service';
import {state} from '@angular/animations';
import {ContenuMenuService} from '../resource/menu/contenu-menu.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    @Input() listMenuPricipal;
    @Input() listeMenuVisible;
    @Input() listeContenu;

    @Input() state;
    nomMenu: string;
    nomSousMenu: string;
    openSousMenus: boolean = false;
    stateMenu: string;
    /** APPLICATIONS */
    canRenderApplication: boolean;
    canRenderBaseInterlocuteur: boolean;
    canRenderParametrage: Observable<boolean>;
    canRenderSuperAdmin: Promise<boolean>;
    canRenderAdminContenu: Promise<boolean>;
    icone: string = 'fas fa-cart-arrow-down';
    @Output() emitCloseMenu = new EventEmitter<boolean>();
    @Output() emitClose = new EventEmitter<String>();
    apiUrl = environment.api;

    constructor(private userStore: UserStore,
                private notificationService: NotificationService,
                private userService: UserService,
                private menuService: MenuService,
                private contenuMenuService: ContenuMenuService,
                private router: Router
    ) {
    }

    queryBuild: QueryBuild = new QueryBuild();

    ngOnInit() {
        this.nomMenu = 'Application';
        this.userService.getUser().subscribe(data => {
            const bidule = this.userService.getUser().toPromise();
            this.userStore.setUser(data);
            this.userStore.isLoggedIn = data.id > 0;

            this.userStore.user.subscribe(() => {
                this.canRenderApplication = this.userStore.isLoggedIn;
                this.canRenderBaseInterlocuteur = this.userStore.isLoggedIn;
                this.canRenderParametrage = anyTrue(this.userStore.hasRight('USERS_CREATE'), this.userStore.hasRight('INFO_FRANCHISE_READ'));
                this.canRenderSuperAdmin = this.userStore.hasProfil(profils.SUPER_ADMIN);
                this.canRenderAdminContenu = this.userStore.hasProfil(profils.ADMIN_CONTENU);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    changeMenu(nom: string) {
        this.nomMenu = nom;
        this.openSousMenus = false;
        // this.emitCloseMenu.emit(true);
        this.emitClose.emit('open');
        console.log(this.listeContenu);
    }

    changeSousMenu(nomSous: string) {
        this.nomSousMenu = nomSous;
        this.openSousMenus = true;
        // this.emitCloseMenu.emit(true);
        this.emitClose.emit('open');
        if (this.nomSousMenu == this.nomMenu) {
            this.changeMenu(this.nomMenu);
        }
    }

    closeMenu() {
        // this.emitCloseMenu.emit();
        this.emitCloseMenu.emit();
    }

    public gotoDetails(url, contenu) {
        this.closeMenu();
        this.router.navigate([url, contenu.id]).then((e) => {
            if (e) {
                // console.log('Navigation is successful!');
            } else {
                // console.log('Navigation has failed!');
            }
        });
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.closeMenu();
    }

}
