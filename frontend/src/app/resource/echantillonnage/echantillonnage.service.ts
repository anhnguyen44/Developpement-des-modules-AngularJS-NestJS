import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { IEchantillonnage, Echantillonnage } from '@aleaac/shared';

@Injectable()
export class EchantillonnageService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createEchantillonnage(echantillonnage: IEchantillonnage): Observable<Echantillonnage> {
    const $data = this.http
      .post(this.EchantillonnageApi, echantillonnage).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getByZoneId(idZone: number): Observable<Echantillonnage[]> {
    const $data = this.http
      .get(this.EchantillonnageApi + '/getAll/' + idZone).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getEchantillonnageById(id: number): Observable<Echantillonnage> {
    return <Observable<Echantillonnage>>this.resourceService.getResource(id, 'echantillonnage');
  }

  removeEchantillonnage(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'echantillonnage');
  }

  updateEchantillonnage(echantillonnage: Echantillonnage): Observable<Echantillonnage> {
    return <Observable<Echantillonnage>>this.resourceService.updateResource(echantillonnage, 'echantillonnage');
  }

  private get EchantillonnageApi(): string {
    return this.apiUrl + '/echantillonnage';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post Echantillonnage...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
