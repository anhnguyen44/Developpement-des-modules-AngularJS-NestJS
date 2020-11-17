import { IMateriauConstructionAmiante, MateriauConstructionAmiante } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, share, take } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MateriauConstructionAmianteService {
  apiURL = environment.api + '/materiau-construction-amiante';
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) { }

  createMateriauConstructionAmiante(materiauConstructionAmiante: IMateriauConstructionAmiante): Observable<IMateriauConstructionAmiante> {
    const $data = this.http
      .post(this.materiauConstructionAmianteApi, materiauConstructionAmiante).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllMateriauConstructionAmiante(): Observable<MateriauConstructionAmiante[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('materiau-construction-amiante') + '/getAll')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getMateriauConstructionAmianteById(id: number): Observable<MateriauConstructionAmiante> {
    return <Observable<MateriauConstructionAmiante>>this.resourceService.getResource(id, 'materiau-construction-amiante');
  }

  removeMateriauConstructionAmiante(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'materiau-construction-amiante');
  }

  updateMateriauConstructionAmiante(materiauConstructionAmiante: MateriauConstructionAmiante): Observable<MateriauConstructionAmiante> {
    return <Observable<MateriauConstructionAmiante>>this.resourceService
    .updateResource(materiauConstructionAmiante, 'materiau-construction-amiante');
  }

  countAll(): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('materiau-construction-amiante') + '/countAll/')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  truncate(): Observable<number> {
    const $data = this.http
      .post(this.resourceService.resourcesUrl('materiau-construction-amiante') + '/truncate', {})
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get materiauConstructionAmianteApi(): string {
    return this.apiUrl + '/materiau-construction-amiante';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post materiauConstructionAmiante...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
