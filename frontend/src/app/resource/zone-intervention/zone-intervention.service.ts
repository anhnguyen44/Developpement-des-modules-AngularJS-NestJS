import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';
import { IZoneIntervention, ZoneIntervention } from '@aleaac/shared';

@Injectable()
export class ZoneInterventionService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) { }

  createZoneIntervention(zoneIntervention: IZoneIntervention): Observable<ZoneIntervention> {
    const $data = this.http
      .post(this.zoneInterventionApi, zoneIntervention).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  duplicateZoneIntervention(idZoneIntervention: number, idStrat: number): Observable<ZoneIntervention> {
    const $data = this.http
      .post(this.zoneInterventionApi + '/duplicate/' + idZoneIntervention + '/' + idStrat, {}).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllZoneIntervention(): Observable<ZoneIntervention[]> {
    return <Observable<ZoneIntervention[]>>this.resourceService.getResources('zone-intervention');
  }

  getZoneInterventionById(id: number): Observable<ZoneIntervention> {
    return <Observable<ZoneIntervention>>this.resourceService.getResource(id, 'zone-intervention');
  }

  removeZoneIntervention(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'zone-intervention');
  }

  updateZoneIntervention(zoneIntervention: ZoneIntervention): Observable<ZoneIntervention> {
    return <Observable<ZoneIntervention>>this.resourceService.updateResource(zoneIntervention, 'zone-intervention');
  }

  getByStrategie(idStrategie: number): Observable<ZoneIntervention[]> {
    const $data = this.http
      .get(this.zoneInterventionApi + '/all/' + idStrategie).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  genererPrelevements(idZone: number): Observable<ZoneIntervention[]> {
    const $data = this.http
      .post(this.zoneInterventionApi + '/init-prelevements/' + idZone, {}).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  updateNbPrelevementsARealiser(idZone: number): Observable<ZoneIntervention[]> {
    const $data = this.http
      .post(this.zoneInterventionApi + '/update-nb-prel-a-realiser/' + idZone, {}).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  private get zoneInterventionApi(): string {
    return this.apiUrl + '/zone-intervention';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post zoneIntervention...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
