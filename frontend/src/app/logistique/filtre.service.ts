import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {Filtre} from './Filtre';

@Injectable({
  providedIn: 'root'
})
export class FiltreService {
    apiUrl = environment.api + '/filtre';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Filtre[]> {
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

    get(idFiltre: number): Observable<Filtre> {
        return this.http.get(this.apiUrl + '/' + idFiltre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(filtre: Filtre): Observable<Filtre> {
        return this.http.post(this.apiUrl, filtre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(filtre: Filtre) {
        return this.http.put(this.apiUrl, filtre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(filtre: Filtre) {
        return this.http.delete(this.apiUrl + '/' + filtre.id).pipe(share(), take(1));
    }

    getStock(idFranchise: number): Observable<{idTypeFiltre: number, idBureau: number, count: number}[]> {
        return this.http.get(this.apiUrl + '/getStock/' + idFranchise).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getNonAffecte(idFranchise: number) {
        return this.http.get(this.apiUrl + '/getNonAffecte/' + idFranchise).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
