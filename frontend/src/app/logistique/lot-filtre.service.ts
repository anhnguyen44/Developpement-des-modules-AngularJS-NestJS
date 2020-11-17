import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {LotFiltre} from './LotFiltre';

@Injectable({
  providedIn: 'root'
})
export class LotFiltreService {
    apiUrl = environment.api + '/lot-filtre';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<LotFiltre[]> {
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

    get(idLotFiltre: number): Observable<LotFiltre> {
        return this.http.get(this.apiUrl + '/' + idLotFiltre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(lotFiltre: LotFiltre): Observable<LotFiltre> {
        return this.http.post(this.apiUrl, lotFiltre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(lotFiltre: LotFiltre) {
        return this.http.put(this.apiUrl, lotFiltre).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    genererPlancheEtiquette(idLotFiltre: number): Observable<Blob> {
        return this.http.get(this.apiUrl + '/generatePlanche/' + idLotFiltre, {responseType: 'blob'});
    }
}
