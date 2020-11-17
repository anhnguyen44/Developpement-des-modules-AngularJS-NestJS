import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, share, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Chantier } from './Chantier';
import { Fichier } from '../resource/fichier/Fichier';
import { QueryService } from '../resource/query-builder/query.service';
import { QueryBuild } from '../resource/query-builder/QueryBuild';
import {ZoneIntervention} from '@aleaac/shared';


@Injectable({
    providedIn: 'root'
})
export class ChantierService {
    apiUrl = environment.api + '/chantier';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    get(idChantier: number): Observable<Chantier> {
        return this.http.get(this.apiUrl + '/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getSimple(idChantier: number): Observable<Chantier> {
        return this.http.get(this.apiUrl + '/get-simple/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getZI(idChantier: number): Observable<ZoneIntervention[]> {
        return this.http.get(this.apiUrl + '/getZI/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<Chantier[]> {
        return this.http.get(this.apiUrl + '/all/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateStrategie(idChantier: number): Observable<Fichier> {
        return this.http.get(environment.api + '/strategie/generate/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateStrategieTest(idChantier: number): Observable<Fichier> {
        return this.http.get(environment.api + '/strategie/generate-test/' + idChantier).pipe(
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

    create(devisCommande: Chantier): Observable<Chantier> {
        return this.http.post(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(devisCommande: Chantier) {
        return this.http.put(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    partialUpdate(devisCommande: Chantier) {
        return this.http.patch(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(idChantier: number) {
        return this.http.delete(this.apiUrl + '/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    imprimer(idChantier: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/generate/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    figer(idChantier: number): Observable<Chantier> {
        return this.http.get(this.apiUrl + '/figer/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateFullOI(idChantier: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/generateOI/' + idChantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    askValidation(chantier: Chantier): Observable<Chantier> {
        return this.http.post(this.apiUrl + '/askValidation/' + chantier.id, chantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    validate(chantier: Chantier): Observable<Chantier> {
        return this.http.post(this.apiUrl + '/validate/' + chantier.id, chantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    unlock(chantier: Chantier): Observable<Chantier> {
        return this.http.post(this.apiUrl + '/unlock/' + chantier.id, chantier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
