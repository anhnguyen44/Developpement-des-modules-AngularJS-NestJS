import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { IGrilleTarif, GrilleTarif } from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';
import { Recherche } from '../query-builder/recherche/Recherche';
import {QueryService} from '../query-builder/query.service';
import {QueryBuild} from '../query-builder/QueryBuild';

@Injectable({
  providedIn: 'root'
})
export class GrilleTarifService {
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) { }

  createGrilleTarif(grilleTarif: IGrilleTarif): Observable<IGrilleTarif> {
    const $data = this.http
      .post(this.grilleTarifApi, grilleTarif).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllGrilleTarif(): Observable<GrilleTarif[]> {
    return <Observable<GrilleTarif[]>>this.resourceService.getResources('grille-tarif');
  }

  getGrilleTarifById(id: number): Observable<GrilleTarif> {
    return <Observable<GrilleTarif>>this.resourceService.getResource(id, 'grille-tarif');
  }

  removeGrilleTarif(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'grille-tarif');
  }

  updateGrilleTarif(grilleTarif: GrilleTarif): Observable<GrilleTarif> {
    return <Observable<GrilleTarif>>this.resourceService.updateResource(grilleTarif, 'grille-tarif');
  }

  getAll(idFranchise: number, queryBuild: QueryBuild): Observable<GrilleTarif[]> {
    return this.http.get(this.grilleTarifApi + '/all/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
    return this.http.get(this.grilleTarifApi + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  initGrillesFranchise(idFranchise: number): Observable<void> {
    const $data = this.http
      .post(this.resourceService.resourcesUrl('grille-tarif') + '/init-grilles-franchise', { idFranchise })
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  duplicate(idFrom: number, reference: string): Observable<GrilleTarif> {
    console.log('serv');
    const $data = this.http
      .post(this.resourceService.resourcesUrl('grille-tarif') + '/duplicate', { idFrom: idFrom, reference: reference })
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPublicByFranchise(idFranchise: number): Observable<GrilleTarif[]> {
      return this.http.get(this.grilleTarifApi + '/public/' + idFranchise).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  getPublicDevisByFranchise(idFranchise: number): Observable<GrilleTarif[]> {
        return this.http.get(this.grilleTarifApi + '/public-devis/' + idFranchise).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
  }

  private get grilleTarifApi(): string {
    return this.apiUrl + '/grille-tarif';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post grilleTarif...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
