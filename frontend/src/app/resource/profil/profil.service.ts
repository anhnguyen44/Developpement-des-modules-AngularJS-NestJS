import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IProfil } from '@aleaac/shared';
import { Profil } from './Profil';
import {NotificationService} from '../../notification/notification.service';
import {Recherche} from '../query-builder/recherche/Recherche';
import {QueryService} from '../query-builder/query.service';
import {QueryBuild} from '../query-builder/QueryBuild';

@Injectable( {
  providedIn: 'root'
})
export class ProfilService {
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) {}

  createProfil(profil: IProfil): Observable<IProfil> {
    const $data = this.http
      .post(this.profilApi, profil).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllProfil(): Observable<Profil[]> {
    return <Observable<Profil[]>>this.resourceService.getResources('profil');
  }

  getProfilById(id: number): Observable<Profil> {
    return <Observable<Profil>>this.resourceService.getResource(id, 'profil');
  }

  removeProfil(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'profil');
  }

  updateProfil(profil: Profil): Observable<Profil> {
    return <Observable<Profil>>this.resourceService.updateResource(profil, 'profil');
  }

  countAll(queryBuild: QueryBuild): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('profil') + '/countAll' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(queryBuild: QueryBuild): Observable<Profil[]> {

    const $data = this.http
      .get(this.resourceService.resourcesUrl('profil') + '/page/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getAllProfilInterne(): Observable<Profil[]>{
    const $data = this.http
      .get(this.resourceService.resourcesUrl('profil') + '/interne')
      .pipe(
        map((resp: any) => resp.data),
        share()
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getAllProfilExterne(): Observable<Profil[]>{
    const $data = this.http
      .get(this.resourceService.resourcesUrl('profil') + '/externe')
      .pipe(
        map((resp: any) => resp.data),
        share()
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get profilApi(): string {
    return this.apiUrl + '/profil';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post profil...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
