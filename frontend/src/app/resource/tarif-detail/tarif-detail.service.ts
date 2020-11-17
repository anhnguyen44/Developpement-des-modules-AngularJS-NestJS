import { ITarifDetail, TarifDetail } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, share, take } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import {environment} from '../../../environments/environment';
import {Recherche} from '../query-builder/recherche/Recherche';
import {DevisCommande} from '../../devis-commande/DevisCommande';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';



@Injectable( {
  providedIn: 'root'
})
export class TarifDetailService {
  apiURL = environment.api + '/tarif-detail';
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) {}

  createTarifDetail(tarifDetail: ITarifDetail): Observable<ITarifDetail> {
    const $data = this.http
      .post(this.tarifDetailApi, tarifDetail).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllTarifDetail(): Observable<TarifDetail[]> {
    return <Observable<TarifDetail[]>>this.resourceService.getResources('tarif-detail');
  }

  getTarifDetailById(id: number): Observable<TarifDetail> {
    return <Observable<TarifDetail>>this.resourceService.getResource(id, 'tarif-detail');
  }

  removeTarifDetail(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'tarif-detail');
  }

  updateTarifDetail(tarifDetail: TarifDetail): Observable<TarifDetail> {
    return <Observable<TarifDetail>>this.resourceService.updateResource(tarifDetail, 'tarif-detail');
  }

  countAll(): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('tarif-detail') + '/countAll/')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(parPage: number, nbPage: number): Observable<TarifDetail[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('tarif-detail') + '/page/' + parPage + '/' + nbPage)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getByIdGrilles(queryBuild: QueryBuild): Observable<TarifDetail[]> {
      const query = this.queryService.parseQuery(queryBuild);
      return this.http.get(this.apiURL + '/byGrilles' + query).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  countByIdGrilles(queryBuild: QueryBuild): Observable<number> {
      const query = this.queryService.parseQuery(queryBuild);
      return this.http.get(this.apiURL + '/countByGrilles' + query).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  private get tarifDetailApi(): string {
    return this.apiUrl + '/tarif-detail';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post tarifDetail...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
