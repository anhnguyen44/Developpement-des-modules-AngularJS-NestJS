import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {Intervention} from './Intervention';
import {map, share, take} from 'rxjs/operators';
import {QueryService} from '../resource/query-builder/query.service';

@Injectable({
    providedIn: 'root'
})
export class InterventionService {
    apiUrl: string = environment.api + '/intervention';

    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) {
    }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Intervention[]> {
        return this.http.get(this.apiUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getByStrategie(idStrategie: number, queryBuild: QueryBuild): Observable<Intervention[]> {
        return this.http.get(this.apiUrl + '/getByStrategie/' + idStrategie + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countByStrategie(idStrategie: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/getByStrategie/' + idStrategie + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    get(idIntervention: number): Observable<Intervention> {
        return this.http.get(this.apiUrl + '/' + idIntervention).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(intervention: Intervention): Observable<Intervention> {
        return this.http.post(this.apiUrl, intervention).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(intervention: Intervention): Observable<Intervention> {
        return this.http.put(this.apiUrl, intervention).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateOI(idIntervention: number): Observable<Intervention> {
        return this.http.get(this.apiUrl + '/generateOI/' + idIntervention).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getInInterval(idBureau: number, dd: string, df: string): Observable<Intervention[]> {
        return this.http.get(this.apiUrl + '/getInInterval/' + idBureau + '/' + dd + '/' + df).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getInIntervalAllStatut(idBureau: number, dd: string, df: string): Observable<Intervention[]> {
        return this.http.get(this.apiUrl + '/getInIntervalAllStatut/' + idBureau + '/' + dd + '/' + df).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAllValide(idBureau): Observable<Intervention[]> {
        return this.http.get(this.apiUrl + '/getAllValide/' + idBureau).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
