import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { IProcessusZone, ProcessusZone } from '@aleaac/shared';

@Injectable()
export class ProcessusZoneService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createProcessusZone(horairesOccupationLocaux: IProcessusZone): Observable<ProcessusZone> {
    const $data = this.http
      .post(this.horairesOccupationLocauxApi, horairesOccupationLocaux).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getByProcessusId(idProcessus: number): Observable<ProcessusZone[]> {
    const $data = this.http
      .get(this.horairesOccupationLocauxApi + '/get-by-processus/' + idProcessus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getByZoneId(idZone: number): Observable<ProcessusZone[]> {
    const $data = this.http
      .get(this.horairesOccupationLocauxApi + '/get-by-zone/' + idZone).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getProcessusZoneById(id: number): Observable<ProcessusZone> {
    return <Observable<ProcessusZone>>this.resourceService.getResource(id, 'processus-zone');
  }

  removeProcessusZone(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'processus-zone');
  }

  updateProcessusZone(horairesOccupationLocaux: ProcessusZone): Observable<ProcessusZone> {
    return <Observable<ProcessusZone>>this.resourceService.updateResource(horairesOccupationLocaux, 'processus-zone');
  }

  private get horairesOccupationLocauxApi(): string {
    return this.apiUrl + '/processus-zone';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post horairesOccupationLocaux...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
