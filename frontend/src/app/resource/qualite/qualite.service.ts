import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IQualite } from '@aleaac/shared';
import { Qualite } from './Qualite';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class QualiteService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService
  ) {}

  createQualite(qualite: IQualite): Observable<Qualite> {
    const $data = this.http
      .post(this.qualiteApi, {
        qualite: qualite
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllQualite(): Observable<Qualite[]> {
    return <Observable<Qualite[]>>this.resourceService.getResources('qualite');
  }

  getQualiteById(id: number): Observable<Qualite> {
    return <Observable<Qualite>>this.resourceService.getResource(id, 'qualite');
  }

  removeQualite(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'qualite');
  }

  updateQualite(qualite: Qualite): Observable<Qualite> {
    return <Observable<Qualite>>this.resourceService.updateResource(qualite, 'qualite');
  }

  private get qualiteApi(): string {
    return this.apiUrl + '/qualite';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post qualite...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
