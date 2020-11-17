import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { ILocalUnitaire, LocalUnitaire } from '@aleaac/shared';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class LocalUnitaireService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService
  ) { }

  createLocalUnitaire(localUnitaire: ILocalUnitaire): Observable<LocalUnitaire> {
    const $data = this.http
      .post(this.localUnitaireApi, localUnitaire).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllLocalUnitaire(): Observable<LocalUnitaire[]> {
    return <Observable<LocalUnitaire[]>>this.resourceService.getResources('local-unitaire');
  }

  getLocalUnitaireById(id: number): Observable<LocalUnitaire> {
    return <Observable<LocalUnitaire>>this.resourceService.getResource(id, 'local-unitaire');
  }

  removeLocalUnitaire(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'local-unitaire');
  }

  updateLocalUnitaire(localUnitaire: LocalUnitaire): Observable<LocalUnitaire> {
    return <Observable<LocalUnitaire>>this.resourceService.updateResource(localUnitaire, 'local-unitaire');
  }

  private get localUnitaireApi(): string {
    return this.apiUrl + '/local-unitaire';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post localUnitaire...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
