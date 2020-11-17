import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { LoginService } from './login.service';
import { UserService } from './user.service';
import { UserStore } from './user.store';
import { Utilisateur } from '@aleaac/shared';
import { Profil } from '@aleaac/shared';
import { FranchiseService } from '../franchise/franchise.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
        private loginService: LoginService,
        private userStore: UserStore,
        private userService: UserService,
        private franchiseService: FranchiseService,
        private notificationService: NotificationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isAllowedOnState(state.url);
    }

    isAllowedOnState(url: string): boolean {
        const isLoggedIn = this.loginService.loggedIn();

        if (isLoggedIn && this.userStore.user.getValue().id === -1) {
            this.userService.getUser().subscribe(user => {
                if (user) {
                    this.userStore.setUser(user); this.franchiseService.franchises.subscribe((data) => {
                        if (data.length === 0) {
                            this.franchiseService.getByUser(user.id).subscribe((franchises) => {
                                if (!franchises) {
                                    this.notificationService.setNotification('danger', ['Votre compte n\'est associé à aucune franchise.']);
                                    this.loginService.logOut();
                                } else {
                                    this.franchiseService.setFranchises(franchises);
                                    if (localStorage.getItem('franchiseActive')) {
                                        const fra = franchises.find(f => f.id.toString() === localStorage.getItem('franchiseActive'));
                                        if (fra) {
                                            this.franchiseService.setFranchise(fra);
                                        } else if (user.idFranchisePrincipale) {
                                            this.franchiseService.setFranchise(user.franchisePrincipale!);
                                        } else {
                                            this.franchiseService.setFranchise(franchises[0]);
                                        }
                                    } else if (user.franchisePrincipale) {
                                        this.franchiseService.setFranchise(user.franchisePrincipale!);
                                    } else {
                                        this.franchiseService.setFranchise(franchises[0]);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } return isLoggedIn;
    }
}
