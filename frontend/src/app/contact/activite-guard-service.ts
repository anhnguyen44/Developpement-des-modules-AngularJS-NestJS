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
export class ActiviteGuardService implements CanActivate {
    constructor(private router: Router, private loginService: LoginService,
         private userStore: UserStore, private notificationService: NotificationService
        , private userService: UserService, private franchiseService: FranchiseService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return await this.isAllowedOnState(state.url);
    }

    async isAllowedOnState(url: string): Promise<boolean> {
        const isLoggedIn = this.loginService.loggedIn();
        
        return await isLoggedIn;
    }
}
