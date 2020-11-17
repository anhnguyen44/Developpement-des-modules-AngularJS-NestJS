import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { IFranchise, Franchise } from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';
import { environment } from '../../../environments/environment';
import {Recherche} from '../query-builder/recherche/Recherche';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {

  private _franchise: BehaviorSubject<Franchise> = new BehaviorSubject(new Franchise());
  private _franchises: BehaviorSubject<Franchise[]> = new BehaviorSubject([]);
  apiUrl = environment.api;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) { }

  createFranchise(franchise: IFranchise): Observable<Franchise> {
    const $data = this.http
      .post(this.franchiseApi, franchise).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllFranchise(): Observable<Franchise[]> {
    return <Observable<Franchise[]>>this.resourceService.getResources('franchise');
  }

  getFranchiseById(id: number): Observable<IFranchise> {
    return <Observable<IFranchise>>this.resourceService.getResource(id, 'franchise');
  }

  removeFranchise(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'franchise');
  }

  updateFranchise(franchise: Franchise): Observable<Franchise> {
    return <Observable<Franchise>>this.resourceService.updateResource(franchise, 'franchise');
  }

  getByUser(idUtilisateur: number): Observable<Franchise[]> {
    // console.log(idUtilisateur);
    const $data = <Observable<Franchise[]>>this.http.get(this.franchiseApi + '/byUser/' + idUtilisateur).pipe(
      map((resp: any) => resp.data), share(), take(1)
    );
    // console.log($data);
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getWithUsers(idFranchise: number): Observable<Franchise> {
    const $data = <Observable<Franchise>>this.http.get(this.franchiseApi + '/get-with-users/' + idFranchise).pipe(
      map((resp: any) => resp.data), share(), take(1)
    );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  countAll(queryBuild: QueryBuild): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('franchise') + '/countAll' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(queryBuild: QueryBuild): Observable<Franchise[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('franchise') + '/page/' + this.queryService.parseQuery(queryBuild))
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  sortieReseau(id: number): Observable<boolean> {
    const $data = this.http
      .post(this.resourceService.resourcesUrl('franchise') + '/sortie-reseau', {id: id})
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get franchiseApi(): string {
    return this.apiUrl + '/franchise';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post franchise...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }

  // STORE
  get franchise(): Observable<Franchise> {
    return this._franchise.asObservable();
  }

  setFranchise(franchise: Franchise): void {
    this._franchise.next(franchise);
  }

  get franchises(): Observable<Franchise[]> {
    return this._franchises.asObservable();
  }

  setFranchises(franchises: Franchise[]): void {
    this._franchises.next(franchises);
  }
}
