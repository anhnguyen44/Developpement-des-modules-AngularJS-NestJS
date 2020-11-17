import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from './notification/notification.service';
import { LoginService } from './resource/user/login.service';
import { UserStore } from './resource/user/user.store';
import { UserService } from './resource/user/user.service';
import {Utilisateur} from '@aleaac/shared';


@Injectable({
    providedIn: 'root'
})
export class DroitsGuardService implements CanActivate {
    constructor(
        private router: Router,
        private loginService: LoginService,
        private userStore: UserStore,
        private notificationService: NotificationService,
        private userService: UserService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const droitsNeeded = route.data.droits as Array<string>;
        return await this.isAllowedOnState(state.url, droitsNeeded, true);
    }

    async isAllowedOnState(url: string, droitsNeeded, isForRouter): Promise<boolean> {
        const isLoggedIn = this.loginService.loggedIn();
        let result: boolean;
        const userPromise: Promise<any> = new Promise((resolve, reject) => {
            this.userStore.user.subscribe((userByStore) => {
                if (userByStore) {
                    resolve(userByStore);
                } else {
                    this.userService.getUser().subscribe((userByService) => {
                        if (userByService) {
                            this.userStore.setUser(userByService);
                            resolve(userByService);
                        }
                    });
                }
            });
        });
        const user: any = await userPromise;
            if (isLoggedIn) {
                if (!user.profils) {
                    result = false;
                } else {
                    let hasDroits = false;
                    for (const droitNeeded of droitsNeeded) {
                        for (const profilsDroits of user.listeProfilsDroits) {
                            for (const droit of profilsDroits.droits) {
                                if (droit === droitNeeded) {
                                    hasDroits = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (!hasDroits && isForRouter) {
                        this.notificationService.setNotification('warning', ['Vous n\'avez pas accès à cette page.']);
                        this.router.navigateByUrl('/');
                    }
                    result = hasDroits;
                }
            } else {
                this.notificationService.setNotification('warning', ['Vous n\'êtes pas connecté.']);
                this.router.navigateByUrl('/');
                result = false;
            }

            return result;
    }
}
