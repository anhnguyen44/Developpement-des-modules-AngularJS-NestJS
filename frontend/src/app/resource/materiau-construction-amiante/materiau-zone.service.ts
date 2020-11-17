import { IMateriauZone, MateriauZone } from '@aleaac/shared';
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
export class MateriauZoneService {
  apiURL = environment.api + '/materiau-zone';
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) { }

  createMateriauZone(materiauZone: IMateriauZone): Observable<MateriauZone> {
    const $data = this.http
      .post(this.materiauZoneApi, materiauZone).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllMateriauZone(idZone: number): Observable<MateriauZone[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('materiau-zone') + '/getAll/' + idZone)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  countAll(idZone: number): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('materiau-zone') + '/countAll/' + idZone)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getMateriauZoneById(id: number): Observable<MateriauZone> {
    return <Observable<MateriauZone>>this.resourceService.getResource(id, 'materiau-zone');
  }

  removeMateriauZone(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'materiau-zone');
  }

  updateMateriauZone(materiauZone: MateriauZone): Observable<MateriauZone> {
    return <Observable<MateriauZone>>this.resourceService.updateResource(materiauZone, 'materiau-zone');
  }

  private get materiauZoneApi(): string {
    return this.apiUrl + '/materiau-zone';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post materiauZone...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
