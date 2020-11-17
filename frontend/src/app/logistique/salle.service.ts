import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {Salle} from './Salle';
import {RendezVousSalle} from './RendezVousSalle';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
    apiUrl = environment.api + '/salle';
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

    get(idSalle: number): Observable<Salle> {
        return this.http.get(this.apiUrl + '/' + idSalle).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(salle: Salle): Observable<Salle> {
        return this.http.post(this.apiUrl, salle).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(salle: Salle): Observable<Salle> {
        return this.http.put(this.apiUrl, salle).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    addRendezVousSalle(rendezVousSalle: RendezVousSalle) {
        return this.http.post(this.apiUrl + '/rendezVousSalle', rendezVousSalle).pipe(
            map((resp: any) => resp.data)
        );
    }

    removeRendezVousSalle(rendezVousSalle: RendezVousSalle) {
        return this.http.delete(this.apiUrl + '/rendezVousSalle/' + rendezVousSalle.id);
    }
}
