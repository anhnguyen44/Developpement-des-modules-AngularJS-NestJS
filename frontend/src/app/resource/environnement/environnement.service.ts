import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { IEnvironnement, Environnement } from '@aleaac/shared';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class EnvironnementService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService
  ) { }

  createEnvironnement(environnement: IEnvironnement): Observable<Environnement> {
    const $data = this.http
      .post(this.environnementApi, {
        environnement: environnement
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllEnvironnement(): Observable<Environnement[]> {
    return <Observable<Environnement[]>>this.resourceService.getResources('environnement');
  }

  getEnvironnementById(id: number): Observable<Environnement> {
    return <Observable<Environnement>>this.resourceService.getResource(id, 'environnement');
  }

  removeEnvironnement(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'environnement');
  }

  updateEnvironnement(environnement: Environnement): Observable<Environnement> {
    return <Observable<Environnement>>this.resourceService.updateResource(environnement, 'environnement');
  }

  private get environnementApi(): string {
    return this.apiUrl + '/environnement';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post environnement...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
