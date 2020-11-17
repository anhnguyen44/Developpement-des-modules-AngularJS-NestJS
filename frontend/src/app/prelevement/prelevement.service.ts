import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {Prelevement} from '../processus/Prelevement';
import {Observable} from 'rxjs';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';

@Injectable({
  providedIn: 'root'
})
export class PrelevementService {
  apiUrl: string = environment.api + '/prelevement';

  constructor(
      private http: HttpClient,
      private queryService: QueryService
  ) { }

  getAllByType(nomIdParent: string, idParent: number, queryBuild: QueryBuild): Observable<Prelevement[]> {
    console.log(queryBuild);
    return this.http.get(this.apiUrl + '/' + nomIdParent + '/' + idParent + this.queryService.parseQuery(queryBuild)).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  countAllByType(nomIdParent: string, idParent: number, queryBuild: QueryBuild): Observable<number> {
      return this.http.get(this.apiUrl + '/count/' + nomIdParent + '/' + idParent + this.queryService.parseQuery(queryBuild)).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  get(idPrelevement: number): Observable<Prelevement> {
    return this.http.get(this.apiUrl + '/' + idPrelevement).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  create(prelevement: Prelevement): Observable<Prelevement> {
    return this.http.post(this.apiUrl, prelevement).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  update(prelevement: Prelevement): Observable<Prelevement> {
    return this.http.put(this.apiUrl, prelevement).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  delete(idPrelevement: number) {
    return this.http.delete(this.apiUrl + '/' + idPrelevement).pipe(
        map((resp: any) => resp.data)
    );
  }
}
