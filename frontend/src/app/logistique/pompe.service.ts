import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {Consommable} from './Consommable';
import {map, share, take} from 'rxjs/operators';
import {Pompe} from './Pompe';
import {Filtre} from './Filtre';
import {RendezVousPompe} from './RendezVousPompe';

@Injectable({
  providedIn: 'root'
})
export class PompeService {

    apiUrl = environment.api + '/pompe';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Pompe[]> {
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

    getByBureau(idBureau: number, queryBuild: QueryBuild): Observable<Pompe[]> {
        return this.http.get(this.apiUrl + '/getByBureau/' + idBureau + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countByBureau(idBureau: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/countByBureau/' + idBureau + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    get(idPompe: number, queryBuild: QueryBuild) {
        console.log(queryBuild);
        return this.http.get(this.apiUrl + '/' + idPompe + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(pompe: Pompe): Observable<Pompe> {
        return this.http.post(this.apiUrl, pompe).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(pompe: Pompe): Observable<Pompe> {
        return this.http.put(this.apiUrl, pompe).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getStock(idBureau, queryBuild: QueryBuild): Observable<{idTypePompe: number, stock: number}[]> {
        return this.http.get(this.apiUrl + '/getStock/' + idBureau + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getIndisponible(idPompe: number): Observable<Pompe> {
        return this.http.get(this.apiUrl + '/getIndisponible/' + idPompe).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    addRendezVousPompe(rendezVousPompe: RendezVousPompe) {
        return this.http.post(this.apiUrl + '/rendezVousPompe', rendezVousPompe).pipe(
            map((resp: any) => resp.data)
        );
    }

    removeRendezVousPompe(rendezVousPompe: RendezVousPompe) {
        return this.http.delete(this.apiUrl + '/rendezVousPompe/' + rendezVousPompe.id);
    }
}
