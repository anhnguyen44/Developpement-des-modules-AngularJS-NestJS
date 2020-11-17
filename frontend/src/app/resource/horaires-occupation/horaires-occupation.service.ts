import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { IHorairesOccupationLocaux, HorairesOccupationLocaux } from '@aleaac/shared';

@Injectable()
export class HorairesOccupationLocauxService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createHorairesOccupationLocaux(horairesOccupationLocaux: IHorairesOccupationLocaux): Observable<HorairesOccupationLocaux> {
    const $data = this.http
      .post(this.horairesOccupationLocauxApi, horairesOccupationLocaux).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllHorairesOccupationLocaux(): Observable<HorairesOccupationLocaux[]> {
    return <Observable<HorairesOccupationLocaux[]>>this.resourceService.getResources('horaires-occupation');
  }

  getHorairesOccupationLocauxById(id: number): Observable<IHorairesOccupationLocaux> {
    return <Observable<IHorairesOccupationLocaux>>this.resourceService.getResource(id, 'horaires-occupation');
  }

  removeHorairesOccupationLocaux(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'horaires-occupation');
  }

  updateHorairesOccupationLocaux(horairesOccupationLocaux: HorairesOccupationLocaux): Observable<HorairesOccupationLocaux> {
    return <Observable<HorairesOccupationLocaux>>this.resourceService.updateResource(horairesOccupationLocaux, 'horaires-occupation');
  }

  private get horairesOccupationLocauxApi(): string {
    return this.apiUrl + '/horaires-occupation';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post horairesOccupationLocaux...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
