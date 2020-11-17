import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { IBesoinClientLabo, BesoinClientLabo } from '@aleaac/shared';

@Injectable()
export class BesoinClientLaboService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createBesoinClientLabo(besoinClientLabo: IBesoinClientLabo): Observable<BesoinClientLabo> {
    const $data = this.http
      .post(this.besoinClientLaboApi, besoinClientLabo).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllBesoinClientLabo(): Observable<BesoinClientLabo[]> {
    return <Observable<BesoinClientLabo[]>>this.resourceService.getResources('besoin-client-labo');
  }

  getBesoinClientLaboById(id: number): Observable<IBesoinClientLabo> {
    return <Observable<IBesoinClientLabo>>this.resourceService.getResource(id, 'besoin-client-labo');
  }

  removeBesoinClientLabo(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'besoin-client-labo');
  }

  updateBesoinClientLabo(besoinClientLabo: BesoinClientLabo): Observable<BesoinClientLabo> {
    return <Observable<BesoinClientLabo>>this.resourceService.updateResource(besoinClientLabo, 'besoin-client-labo');
  }

  private get besoinClientLaboApi(): string {
    return this.apiUrl + '/besoin-client-labo';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post besoinClientLabo...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
