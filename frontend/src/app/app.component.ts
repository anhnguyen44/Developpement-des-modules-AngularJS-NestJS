import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoaderService } from './loader/loader.service';
import { NotificationService } from './notification/notification.service';
import { FranchiseService } from './resource/franchise/franchise.service';
import { LoginService } from './resource/user/login.service';
import { UserService } from './resource/user/user.service';
import { UserStore } from './resource/user/user.store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isBorderlessPage: boolean;
    isLoaded: boolean = false;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private userStore: UserStore,
        private userService: UserService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private loaderService: LoaderService
    ) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.loaderService.show();
            } else if (event instanceof NavigationEnd) {
                this.loaderService.hide();
            }
        });
        if (this.loginService.loggedIn()) {
            this.userService.getUser().subscribe(user => {
                if (user) {
                    this.userStore.setUser(user);
                    this.franchiseService.franchises.subscribe((data) => {
                        if (data.length === 0) {
                            this.franchiseService.getByUser(user.id).subscribe((franchises) => {
                                if (!franchises) {
                                    this.notificationService.setNotification('danger', ['Votre compte n\'est associé à aucune franchise.']);
                                    this.loginService.logOut();
                                } else {
                                    this.franchiseService.setFranchises(franchises);
                                    const idActiveFranchise = localStorage.getItem('franchiseActive');
                                    if (idActiveFranchise) {
                                        const activeFranchise = franchises.find((franchise) => {
                                            return franchise.id === parseInt(idActiveFranchise, 10);
                                        });
                                        if (activeFranchise) {
                                            this.franchiseService.setFranchise(activeFranchise);
                                        }  else if (user.idFranchisePrincipale) {
                                            this.franchiseService.setFranchise(user.franchisePrincipale!);
                                        } else {
                                            this.franchiseService.setFranchise(franchises[0]);
                                        }
                                    } else if (user.franchisePrincipale) {
                                        localStorage.setItem('franchiseActive', String(user.franchisePrincipale!.id));
                                        this.franchiseService.setFranchise(user.franchisePrincipale!);
                                    } else {
                                        localStorage.setItem('franchiseActive', String(franchises[0].id));
                                        this.franchiseService.setFranchise(franchises[0]);
                                    }
                                }
                                this.isLoaded = true;
                            });
                        }
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.loginService.logOut();
                    this.isLoaded = true;
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.isLoaded = true;
        }
    }

    loggedIn(): boolean {
        return this.loginService.loggedIn();
    }
}
