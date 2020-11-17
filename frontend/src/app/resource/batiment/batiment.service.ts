import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap, catchError, share, take } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { Batiment, IBatiment } from '@aleaac/shared';
import { ResourceService } from '../resource.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class BatimentService {
  apiUrl: string = environment.api + '/batiment';
  constructor(
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService,
    ) { }

  createBatiment(batiment: IBatiment): Observable<Batiment> {
    const $data = this.http
      .post(this.batimentApi, {
        batiment
      }).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllBatiment(): Observable<IBatiment[]> {
    return <Observable<IBatiment[]>>this.resourceService.getResources('batiment');
  }

  getBatimentById(id: number): Observable<IBatiment> {
    return <Observable<IBatiment>>this.resourceService.getResource(id, 'batiment');
  }

  removeBatiment(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'batiment');
  }

  updateBatiment(batiment: Batiment): Observable<Batiment> {
    return <Observable<Batiment>>this.resourceService.updateResource(batiment, 'batiment');
  }

  private get batimentApi(): string {
    return this.apiUrl;
  }


  getBySitePrelevement(id: number): Observable<Batiment[]> {
    return this.http.get(this.apiUrl + '/by-site-prelevement/' + id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  getByChantier(id: number): Observable<Batiment[]> {
    return this.http.get(this.apiUrl + '/by-chantier/' + id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post batiment...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
