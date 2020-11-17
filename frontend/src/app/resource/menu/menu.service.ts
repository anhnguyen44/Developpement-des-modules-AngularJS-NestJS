import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IProduit, Produit } from '@aleaac/shared';
import {NotificationService} from '../../notification/notification.service';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable( {
  providedIn: 'root'
})
export class ProduitService {
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) {}

  createProduit(produit: IProduit): Observable<IProduit> {
    const $data = this.http
      .post(this.produitApi, produit).pipe(
        map((resp: any) => resp.data)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllProduit(): Observable<Produit[]> {
    return <Observable<Produit[]>>this.resourceService.getResources('produit');
  }

  getProduitsTypeFormation(): Observable<Produit[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('produit') + '/typeFormation')
      .pipe(
        map((resp: any) => resp.data),
        share()
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getProduitById(id: number): Observable<Produit> {
    return <Observable<Produit>>this.resourceService.getResource(id, 'produit');
  }

  removeProduit(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'produit');
  }

  updateProduit(produit: Produit): Observable<Produit> {
    return <Observable<Produit>>this.resourceService.updateResource(produit, 'produit');
  }

  countAll(queryBuild: QueryBuild): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('produit') + '/countAll' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share()
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(queryBuild: QueryBuild): Observable<Produit[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('produit') + '/page/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share()
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get produitApi(): string {
    return this.apiUrl + '/produit';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post produit...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
