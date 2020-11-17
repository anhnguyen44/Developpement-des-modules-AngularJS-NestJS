import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import { ITypeBatiment, TypeBatiment } from '@aleaac/shared';

@Injectable()
export class TypeBatimentService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createTypeBatiment(typeBatiment: ITypeBatiment): Observable<ITypeBatiment> {
    const $data = this.http
      .post(this.typeBatimentApi, {
        typeBatiment: typeBatiment
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllTypeBatiment(): Observable<TypeBatiment[]> {
    return <Observable<TypeBatiment[]>>this.resourceService.getResources('type-batiment');
  }

  getTypeBatimentById(id: number): Observable<ITypeBatiment> {
    return <Observable<ITypeBatiment>>this.resourceService.getResource(id, 'type-batiment');
  }

  removeTypeBatiment(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'type-batiment');
  }

  updateTypeBatiment(typeBatiment: TypeBatiment): Observable<TypeBatiment> {
    return <Observable<TypeBatiment>>this.resourceService.updateResource(typeBatiment, 'type-batiment');
  }

  private get typeBatimentApi(): string {
    return this.apiUrl + '/type-batiment';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post typeBatiment...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
