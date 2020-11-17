import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consommable} from './Consommable';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {QueryService} from '../resource/query-builder/query.service';

@Injectable({
  providedIn: 'root'
})
export class ConsommableService {
  aipUrl = environment.api + '/consommable';
  constructor(
      private http: HttpClient,
      private queryService: QueryService
  ) { }

  getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Consommable[]> {
    return this.http.get(this.aipUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
      return this.http.get(this.aipUrl + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

    get(idConsommable: number) {
        return this.http.get(this.aipUrl + '/' + idConsommable).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(consommable: Consommable) {
        return this.http.post(this.aipUrl, consommable).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(consommable: Consommable) {
        return this.http.put(this.aipUrl, consommable);
    }
}
