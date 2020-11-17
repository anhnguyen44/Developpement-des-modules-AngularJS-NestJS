import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Activite } from './Activite';
import { map, share, take } from 'rxjs/operators';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {QueryService} from '../resource/query-builder/query.service';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {
  apiUrl = environment.api + '/activite';
  constructor(
      private http: HttpClient,
      private queryService: QueryService
  ) { }

  getListe(type, id, queryBuild: QueryBuild): Observable<Activite[]> {
    return this.http.get(this.apiUrl + '/' + type + '/' + id + this.queryService.parseQuery(queryBuild)).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  getAll(idFranchise, queryBuild: QueryBuild): Observable<Activite[]> {
    return this.http.get(this.apiUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

    countListe(type, id, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/count/' + type + '/' + id + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countAll(idFranchise, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

  getActivite(id): Observable<Activite> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  updateActivite(activite: Activite) {
    return this.http.put(this.apiUrl, activite).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  createActivite(activite: Activite): Observable<Activite> {
    return this.http.post(this.apiUrl, activite).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  deleteActivite(id): Observable<Activite> {
    return this.http.delete(this.apiUrl + '/' + id).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

    generateXlsx(idFranchise: number) {
        return this.http.get(this.apiUrl + '/generateXlsx/' + idFranchise, {responseType: 'blob'});
    }
}
