import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';


import {User, UserWithoutId} from './user';
import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IUtilisateur } from '@aleaac/shared';
import { Utilisateur } from '@aleaac/shared';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import {Recherche} from '../query-builder/recherche/Recherche';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable()
export class UserService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
      private queryService: QueryService
  ) {}

  createUser(user: IUtilisateur): Observable<Utilisateur> {
    const $data = this.http
      .post(this.usersApi, {
        user: user
      }).pipe(
        map((resp: any) => resp.data)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getUser(): Observable<Utilisateur> {
    const $data = this.http.get(this.apiUrl + '/users/current')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(() => {
        // cannot fetch user, since not logged in
        return of(null);
      })
    );
  }

  getAllUser(): Observable<Utilisateur[]> {
    return <Observable<Utilisateur[]>>this.resourceService.getResources('users');
  }

  getUserById(id: number): Observable<Utilisateur> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/get/' + id)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getUserByIdWithProfilFranchise(id: number): Observable<Utilisateur> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/get-with-profil-franchise/' + id)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  countAll(queryBuild: QueryBuild): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/countAll/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(queryBuild: QueryBuild): Observable<Utilisateur[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/page/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  removeUser(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'users');
  }

  updateUser(user: Utilisateur): Observable<Utilisateur> {
    return <Observable<Utilisateur>>this.resourceService.updateResource(user, 'users');
  }

  getCreatedByCurrent(): Observable<Utilisateur[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/created-by-current')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getByDroitAndFranchise(codeDroit: string, idFranchise: number): Observable<Utilisateur[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/get-by-right-franchise/' + codeDroit + '/' + idFranchise)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getByProfilAndFranchise(idProfil: number, idFranchise: number): Observable<Utilisateur[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('users') + '/get-by-profil-franchise/' + idProfil + '/' + idFranchise)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get usersApi(): string {
    return this.apiUrl + '/users';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post user...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
