import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { LoginService } from '../resource/user/login.service';
import { UserStore } from '../resource/user/user.store';
import { UserService } from '../resource/user/user.service';
import { FranchiseService } from '../resource/franchise/franchise.service';
import { Utilisateur } from '@aleaac/shared';
import { Subscription, of, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ParametrageFranchiseGuardService implements CanActivate {
    constructor(private router: Router, private loginService: LoginService,
        private userStore: UserStore, private notificationService: NotificationService
        , private userService: UserService, private franchiseService: FranchiseService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isAllowedOnState(state.url);
    }

    isAllowedOnState(url: string): boolean {
        const isLoggedIn = this.loginService.loggedIn();
        let result;
        this.userService.getUser().subscribe(user => {
            this.userStore.setUser(user);

             // console.log(user);
            if (!user.profils) {
                this.notificationService.setNotification('danger', ['Vous ne possédez aucun profil sur cette application.']);
                result = false;
            } else {
                const isGerantFranchise = this.userStore.hasRight('INFO_FRANCHISE_READ');
                const boul = this.userStore.hasRight('USERS_CREATE');
                if (boul && !isGerantFranchise) {
                    this.router.navigateByUrl('/parametrage/utilisateur/liste');
                    result = false;
                } else if (!boul && !isGerantFranchise) {
                    this.notificationService.setNotification('warning', ['Vous n\'avez pas accès à cette page.']);
                    this.router.navigateByUrl('/home');
                    result = false;
                } else {
                    result = true && isLoggedIn;
                }
            }
        }, err => {
            console.error(err);
        });
        return true;
    }
}
