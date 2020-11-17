import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {Processus} from './Processus';
import {Observable} from 'rxjs';
import {QueryService} from '../resource/query-builder/query.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessusService {
  apiUrl: string = environment.api + '/processus';
  constructor(
      private http: HttpClient,
      private queryService: QueryService
      ) { }

  getAll(idCompte: number, queryBuild): Observable<Processus[]> {
    return this.http.get(this.apiUrl + '/getAll/' + idCompte + this.queryService.parseQuery(queryBuild)).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  get(idProcessus): Observable<Processus> {
    return this.http.get(this.apiUrl + '/' + idProcessus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  create(processus: Processus): Observable<Processus> {
    return this.http.post(this.apiUrl, processus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  update(processus: Processus): Observable<Processus> {
    return this.http.put(this.apiUrl, processus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  delete(processus: Processus): Observable<Processus> {
    return this.http.delete(this.apiUrl + '/' + processus.id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

}
