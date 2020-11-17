import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { ICivilite } from '../../../../../shared/index';
import { Civilite } from './Civilite';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';

@Injectable()
export class CiviliteService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createCivilite(civilite: ICivilite): Observable<ICivilite> {
    const $data = this.http
      .post(this.civiliteApi, {
        civilite: civilite
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllCivilite(): Observable<ICivilite[]> {
    return <Observable<ICivilite[]>>this.resourceService.getResources('civilite');
  }

  getCiviliteById(id: number): Observable<ICivilite> {
    return <Observable<ICivilite>>this.resourceService.getResource(id, 'civilite');
  }

  removeCivilite(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'civilite');
  }

  updateCivilite(civilite: Civilite): Observable<Civilite> {
    return <Observable<Civilite>>this.resourceService.updateResource(civilite, 'civilite');
  }

  private get civiliteApi(): string {
    return this.apiUrl + '/civilite';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post civilite...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
