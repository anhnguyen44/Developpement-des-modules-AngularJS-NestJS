import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiUrl } from '../api-url';
import { TokenStorage } from './token.storage';
import { UserStore } from './user.store';
import { catchError, map, share, take } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import { FranchiseService } from '../franchise/franchise.service';
import { Utilisateur } from '@aleaac/shared';
import { environment } from '../../../environments/environment.dev';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  private isLoggedIn = false;

  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private tokenStorage: TokenStorage,
    private http: HttpClient,
    private notificationService: NotificationService,
    private userStore: UserStore,
    private router: Router,
    private franchiseService: FranchiseService,
  ) {
    this.isLoggedIn = tokenStorage.token !== undefined;
  }

  logIn(email: string, password: string): void {
    this.isLoggedIn = false;
    this.tokenStorage.clear();
    localStorage.clear();
    this.userStore.clear();
    this.http
      .post(this.loginApi, { login: email, motDePasse: password })
      .pipe(
        map((resp: any) => resp.data),
        catchError(this.handleError), share(), take(1)
      )
      .subscribe((resp: any) => {
        console.log(resp);
        this.isLoggedIn = true;
        this.tokenStorage.set(resp.token);
        this.userStore.setUser(resp.user);
        this.notificationService.setNotification('warning', ['Connexion en cours...']);
        this.franchiseService.getByUser(resp.user.id).subscribe((franchises) => {
          this.franchiseService.setFranchises(franchises);
          if (localStorage.getItem('franchiseActive')) {
            const fra = franchises.find(f => f.id.toString() === localStorage.getItem('franchiseActive'));
            if (fra) {
              this.franchiseService.setFranchise(fra);
            } else if (resp.user.idFranchisePrincipale) {
              this.franchiseService.setFranchise(resp.user.franchisePrincipale!);
            } else {
              this.franchiseService.setFranchise(franchises[0]);
            }
          } else if ((<Utilisateur>resp.user).franchisePrincipale) {
            this.franchiseService.setFranchise((<Utilisateur>resp.user).franchisePrincipale!);
          } else {
            this.franchiseService.setFranchise(franchises[0]);
          }
          this.router.navigate(['/dashboard']);
          this.notificationService.setNotification('success', ['Connecté.']);
        },
          (err) => {
            // console.log(err);
            this.router.navigate(['/login']);
            this.notificationService.setNotification('danger', ['Email ou mot de passe invalide.']);
            this.logOut();
          }
        );
      });
  }

  askResetPassword(email: string, captcha: string): Observable<any> {
    const $data = this.http
      .post(this.loginApi + '/askReset', {
        email: email,
        captcha: captcha
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  doResetPassword(email: string, password: string, token: string): Observable<any> {
    const $data = this.http
      .post(this.loginApi + '/doReset', {
        email: email,
        password: password,
        token: token
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  impersonate(email: string, password: string): void {
    this.http
      .post(this.loginApi + '/impersonate', { login: email, motDePasse: password })
      .pipe(
        map((resp: any) => resp.data),
        catchError(this.handleError), share(), take(1)
      )
      .subscribe((resp: any) => {
        this.isLoggedIn = true;
        localStorage.clear();
        this.tokenStorage.set(resp.token);
        this.userStore.setUser(resp.user);
        this.notificationService.setNotification('warning', ['Connexion en cours...']);
        // console.log('ok11');
        // console.log(resp);
        this.franchiseService.getByUser(resp.user.id).subscribe((franchises) => {
          // console.log('ok12');
          // console.log(franchises);
          this.franchiseService.setFranchises(franchises);
          if (resp.user.franchisePrincipale) {
            this.franchiseService.setFranchise(resp.user.franchisePrincipale!);
          } else {
            this.franchiseService.setFranchise(franchises[0]);
          }
          this.router.navigate(['/dashboard']);
          this.notificationService.setNotification('success', ['Connecté.']);
        },
          (err) => {
            // console.log(err);
            this.router.navigate(['/login']);
            this.notificationService.setNotification('danger', ['Email ou mot de passe invalide.']);
            this.logOut();
          }
        );
      });
  }

  logOut(): void {
    this.isLoggedIn = false;
    this.tokenStorage.clear();
    localStorage.clear();
    this.userStore.clear();
    this.router.navigate(['/login']);
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }

  private get loginApi(): string {
    return this.apiUrl + '/auth';
  }

  private handleError = (errorResp: any): Promise<any> => {
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }

}
