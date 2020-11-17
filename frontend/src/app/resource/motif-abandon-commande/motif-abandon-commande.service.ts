import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IMotifAbandonCommande, MotifAbandonCommande } from '@aleaac/shared';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import {Recherche} from '../query-builder/recherche/Recherche';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class MotifAbandonCommandeService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService,
      private queryService: QueryService
  ) {}

  createMotifAbandonCommande(motifAbandonCommande: IMotifAbandonCommande): Observable<MotifAbandonCommande> {
    const $data = this.http
      .post(this.motifAbandonCommandeApi, motifAbandonCommande).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllMotifAbandonCommande(): Observable<MotifAbandonCommande[]> {
    return <Observable<MotifAbandonCommande[]>>this.resourceService.getResources('motif-abandon-commande');
  }

  getMotifAbandonCommandeById(id: number): Observable<MotifAbandonCommande> {
    return <Observable<MotifAbandonCommande>>this.resourceService.getResource(id, 'motif-abandon-commande');
  }

  removeMotifAbandonCommande(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'motif-abandon-commande');
  }

  updateMotifAbandonCommande(motifAbandonCommande: MotifAbandonCommande): Observable<MotifAbandonCommande> {
    return <Observable<MotifAbandonCommande>>this.resourceService.updateResource(motifAbandonCommande, 'motif-abandon-commande');
  }

  countAll(queryBuild: QueryBuild): Observable<number> {

    const $data = this.http
      .get(this.resourceService.resourcesUrl('motif-abandon-commande') + '/countAll' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(queryBuild: QueryBuild): Observable<MotifAbandonCommande[]> {

    const $data = this.http
      .get(this.resourceService.resourcesUrl('motif-abandon-commande') + '/page/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get motifAbandonCommandeApi(): string {
    return this.apiUrl + '/motif-abandon-commande';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post motifAbandonCommande...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
