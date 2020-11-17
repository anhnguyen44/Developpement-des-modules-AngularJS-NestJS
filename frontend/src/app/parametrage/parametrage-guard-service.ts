import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { LoginService } from '../resource/user/login.service';
import { UserStore } from '../resource/user/user.store';
import { UserService } from '../resource/user/user.service';
import { FranchiseService } from '../resource/franchise/franchise.service';
import { Utilisateur } from '@aleaac/shared';
import { TestRequest } from '@angular/common/http/testing';


@Injectable({
    providedIn: 'root'
})
export class ParametrageGuardService implements CanActivate {
    constructor(private router: Router, private loginService: LoginService,
        private userStore: UserStore, private notificationService: NotificationService
        , private userService: UserService, private franchiseService: FranchiseService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isAllowedOnState(state.url);
    }

    isAllowedOnState(url: string): boolean {
        return this.loginService.loggedIn();
    }
}
