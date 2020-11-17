import { Component, OnInit, ChangeDetectorRef, AfterViewInit, HostListener, OnDestroy, Output, EventEmitter } from '@angular/core';

import { LoginService } from '../resource/user/login.service';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { FranchiseService } from '../resource/franchise/franchise.service';
import { UserStore } from '../resource/user/user.store';
import { UserService } from '../resource/user/user.service';
import { Franchise, MenuDefini, Utilisateur, ContenuMenu } from '@aleaac/shared';
import { fadeIn, fadeOut, menuAnimation } from '../resource/animation';
import { Menu } from '../menu/Menu';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { NotificationUserService } from '../resource/notif-user/notif-user.service';
import { UtilisateurProfil } from '../resource/profil/UtilisateurProfil';
import { QueryBuild } from '../resource/query-builder/QueryBuild';
import { ContenuMenuService } from '../resource/menu/contenu-menu.service';


@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    animations: [menuAnimation, fadeIn, fadeOut]
})
export class TopnavComponent implements OnInit, OnDestroy {
    listMenuPricipal: MenuDefini[];
    listeMenuVisible: MenuDefini[];
    displayMenu: Boolean = false;
    franchise: Franchise;
    franchises: Franchise[];
    isLoggedIn: boolean;
    state: string = 'close';
    stateCreer: string = 'close';
    menus: Menu[];
    isSticky: boolean = false;
    nbNotif: number = 0;
    intervalNbNotif: any;
    userSubscription: Subscription;
    franchiseSubscription: Subscription;
    test: Promise<boolean>;
    openMenu: Boolean = false;
    utilisateurCurrent: Utilisateur;
    listeContenu: ContenuMenu[];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private router: Router,
        private loginService: LoginService,
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private userStore: UserStore,
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
        private notificationService: NotificationService,
        private notificationUserService: NotificationUserService,
        private menuServie: MenuService,
        private contenuMenuService: ContenuMenuService,
    ) { }

    ngOnInit() {
        if (!this.franchiseSubscription) {
            this.franchiseSubscription = this.franchiseService.franchises.subscribe((data1) => {
                this.franchises = data1;

                if (!this.userSubscription) {
                    this.userSubscription = this.userStore.user.subscribe(util => {
                        clearInterval(this.intervalNbNotif);
                        if (util.id && util.id > 0) {
                            this.notificationUserService.countUnread(util.id).subscribe(nbNotif => {
                                this.nbNotif = nbNotif;
                            });

                            this.intervalNbNotif = setInterval(() => {
                                this.notificationUserService.countUnread(util.id).subscribe(nbNotif2 => {
                                    this.nbNotif = nbNotif2;
                                });
                            }, 30000);
                        } else {
                            if (this.userSubscription) {
                                this.userSubscription.unsubscribe();
                            }
                        }

                        if (localStorage.getItem('franchiseActive')) {
                            const fra = data1.find(f => f.id.toString() === localStorage.getItem('franchiseActive'));
                            if (fra) {
                                this.franchise = fra;
                            } else if (util.idFranchisePrincipale) {
                                this.franchise = util.franchisePrincipale!;
                            } else {
                                this.franchise = this.franchises[0];
                            }
                        } else if (util.idFranchisePrincipale) {
                            this.franchise = util.franchisePrincipale!;
                        } else {
                            this.franchise = this.franchises[0];
                        }
                    });
                }
            });
        }
        this.menuService.menus.subscribe((menus) => {
            this.menus = menus;
            this.cdRef.detectChanges();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.getMenusAffiche();
    }

    loggedIn(): boolean {
        return this.loginService.loggedIn();
    }

    logOut() {
        this.loginService.logOut();
        clearInterval(this.intervalNbNotif);
        this.userSubscription.unsubscribe();
        this.franchiseSubscription.unsubscribe();
    }

    changeFranchise(franchise) {
        localStorage.setItem('franchiseActive', String(franchise.id));
        this.franchiseService.setFranchise(franchise);
    }

    menu() {
        // this.clickNav = 'clicked';
        // console.log(this.clickNav);
        if (this.state === 'open') {
            this.state = 'close';
        } else {
            this.state = 'open';
            this.getMenusAffiche();
        }
    }

    getMenusAffiche() {
        this.menuService.getMenusPricipalAll().subscribe(listMenu2 => {
            this.listMenuPricipal = listMenu2;
            this.userStore.user.subscribe(user => {
                this.utilisateurCurrent = user;
                this.listMenuPricipal.forEach(elementPri => {
                    if (elementPri.droitsForMenu != null) {
                        if (!this.checkRightMenu(this.utilisateurCurrent.profils!, [elementPri.droitsForMenu!.code])) {
                            this.listMenuPricipal = this.listMenuPricipal!.filter(itemEn => itemEn.id !== elementPri.id);
                        }
                    }
                });

                this.menuService.getAllVisible().subscribe((data) => {
                    this.listeMenuVisible = data;
                    this.listeMenuVisible.forEach(menuEn => {
                        if (menuEn.droitsForMenu != null) {
                            if (!this.checkRightMenu(this.utilisateurCurrent.profils!, [menuEn.droitsForMenu!.code])) {
                                this.listeMenuVisible = this.listeMenuVisible!.filter(itemEn => itemEn.id !== menuEn.id);
                            }
                        }
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est servenue.']);
                });

                this.contenuMenuService.getAllContenusVisible(this.queryBuild).subscribe(data2 => {
                    this.listeContenu = data2;
                    this.listeContenu.forEach(contenu => {
                        if (contenu.permission != null) {
                            if (!this.checkRightMenu(this.utilisateurCurrent.profils!, [contenu.permission!.code])) {
                                this.listeContenu = this.listeContenu.filter(item => item.id !== contenu.id);
                            }
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.log(err);
                    });
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.log(err);
                });

            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });


    }

    checkRightMenu(utilisaterProfils: UtilisateurProfil[], toCheck: string[]): boolean {
        let result = false;

        for (const userProfil of utilisaterProfils) {
            if (!userProfil.profil.droits) {
                continue;
            }
            if (userProfil.profil.droits.some((droit) => toCheck.indexOf(droit.code) > -1)) {
                result = true;
                break;
            }
        }

        return result;
    }

    closeMenu(str: String) {
        this.state = 'close';
    }

    menuCreer() {
        this.state = 'close'; if (this.stateCreer === 'open') {
            this.stateCreer = 'close';
        } else {
            this.stateCreer = 'open';
        }
    }

    closeMenuCreer() {
        this.stateCreer = 'close';
    }

    creer(type: string) {
        switch (type) {
            default:
                break;
        }
    }

    compareFranchise(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    @HostListener('window:scroll', ['$event'])
    scroll(event) {
        if (window.pageYOffset > 120) {
            this.isSticky = true;
        }
        if (window.pageYOffset < 60) {
            this.isSticky = false;
        }
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.franchiseSubscription.unsubscribe();
        clearInterval(this.intervalNbNotif);
    }
}
