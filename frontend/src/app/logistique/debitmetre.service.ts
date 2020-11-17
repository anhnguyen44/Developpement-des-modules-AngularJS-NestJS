import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {Salle} from './Salle';
import {RendezVousSalle} from './RendezVousSalle';
import {Debitmetre} from './Debitmetre';

@Injectable({
  providedIn: 'root'
})
export class DebitmetreService {
    apiUrl = environment.api + '/debitmetre';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Salle[]> {
        return this.http.get(this.apiUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    get(idDebitmetre: number): Observable<Salle> {
        return this.http.get(this.apiUrl + '/' + idDebitmetre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(debitmetre: Debitmetre): Observable<Salle> {
        return this.http.post(this.apiUrl, debitmetre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(debitmetre: Debitmetre): Observable<Salle> {
        return this.http.put(this.apiUrl, debitmetre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
