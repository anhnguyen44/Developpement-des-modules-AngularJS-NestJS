import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { IGES, GES } from '@aleaac/shared';

@Injectable()
export class GESService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createGES(Ges: IGES): Observable<GES> {
    const $data = this.http
      .post(this.GesApi, Ges).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getByProcessusZoneId(idProcessusZone: number): Observable<GES[]> {
    const $data = this.http
      .get(this.GesApi + '/getAll/' + idProcessusZone).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getGESById(id: number): Observable<GES> {
    return <Observable<GES>>this.resourceService.getResource(id, 'ges');
  }

  removeGES(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'ges');
  }

  updateGES(Ges: GES): Observable<GES> {
    return <Observable<GES>>this.resourceService.updateResource(Ges, 'ges');
  }

  private get GesApi(): string {
    return this.apiUrl + '/ges';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post Ges...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
