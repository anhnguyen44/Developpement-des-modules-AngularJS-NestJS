import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { LoginService } from '../resource/user/login.service';
import { UserStore } from '../resource/user/user.store';
import { UserService } from '../resource/user/user.service';
import { FranchiseService } from '../resource/franchise/franchise.service';
import { Utilisateur } from '@aleaac/shared';


@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuardService implements CanActivate {
    constructor(private router: Router, private loginService: LoginService,
         private userStore: UserStore, private notificationService: NotificationService
        , private userService: UserService, private franchiseService: FranchiseService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return await this.isAllowedOnState(state.url);
    }

    async isAllowedOnState(url: string): Promise<boolean> {
        const isLoggedIn = this.loginService.loggedIn();
        let result: boolean;
        const user: Utilisateur = await this.userService.getUser().toPromise();
            // console.log(user);
            if (isLoggedIn && url.indexOf('superadmin') > -1) {
                if (!user.profils) {

                    result = false;
                } else {
                    let isSuperAdmin = false;
                    for (const profil of user.profils) {
                        if (profil.profil.nom === 'Super Admin') {
                            isSuperAdmin = true;
                            break;
                        }
                    }

                    if (isSuperAdmin === false) {
                        this.notificationService.setNotification('warning', ['Vous n\'avez pas accès à cette page.']);
                        this.router.navigateByUrl('/');
                    }
                    result = isSuperAdmin;
                }
            } else {
                this.notificationService.setNotification('warning', ['Vous n\'avez pas accès à cette page.']);
                this.router.navigateByUrl('/');

                result = false;
            }

        this.userStore.setUser(user);
        return await result;
    }
}
