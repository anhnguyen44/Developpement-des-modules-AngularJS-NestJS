import { ICodePostal, CodePostal } from '@aleaac/shared';
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
export class CodePostalService {
  apiURL = environment.api + '/code-postal';
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService,
    private queryService: QueryService
  ) {}

  createCodePostal(tarifDetail: ICodePostal): Observable<ICodePostal> {
    const $data = this.http
      .post(this.tarifDetailApi, tarifDetail).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllCodePostal(): Observable<CodePostal[]> {
    return <Observable<CodePostal[]>>this.resourceService.getResources('code-postal');
  }

  getByPartialCp(cp: string): Observable<CodePostal[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('code-postal') + '/by-partial-cp/' + cp)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getByPartialVille(ville: string): Observable<CodePostal[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('code-postal') + '/by-partial-ville/' + ville)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getCodePostalById(id: number): Observable<CodePostal> {
    return <Observable<CodePostal>>this.resourceService.getResource(id, 'code-postal');
  }

  removeCodePostal(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'code-postal');
  }

  updateCodePostal(tarifDetail: CodePostal): Observable<CodePostal> {
    return <Observable<CodePostal>>this.resourceService.updateResource(tarifDetail, 'code-postal');
  }

  countAll(): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('code-postal') + '/countAll/')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  getPage(parPage: number, nbPage: number): Observable<CodePostal[]> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('code-postal') + '/page/' + parPage + '/' + nbPage)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get tarifDetailApi(): string {
    return this.apiUrl + '/code-postal';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post tarifDetail...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
