import { SitePrelevement } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Fichier } from '../resource/fichier/Fichier';
import { QueryService } from '../resource/query-builder/query.service';
import { QueryBuild } from '../resource/query-builder/QueryBuild';

@Injectable({
    providedIn: 'root'
})
export class SitePrelevementService {
    apiUrl = environment.api + '/site-prelevement';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    get(idSitePrelevement: number): Observable<SitePrelevement> {
        return this.http.get(this.apiUrl + '/' + idSitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll(idChantier: number, queryBuild: QueryBuild): Observable<SitePrelevement[]> {
        return this.http.get(this.apiUrl + '/all/' + idChantier + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countAll(idChantier: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.apiUrl + '/countAll/' + idChantier + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(sitePrelevement: SitePrelevement): Observable<SitePrelevement> {
        return this.http.post(this.apiUrl, sitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(sitePrelevement: SitePrelevement) {
        return this.http.put(this.apiUrl, sitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    partialUpdate(sitePrelevement: SitePrelevement) {
        delete sitePrelevement.idAdresse;
        return this.http.patch(this.apiUrl + '/' + sitePrelevement.id, sitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(idSitePrelevement: number) {
        return this.http.delete(this.apiUrl + '/' + idSitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    imprimer(idSitePrelevement: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/generate/' + idSitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    figer(idSitePrelevement: number): Observable<SitePrelevement> {
        return this.http.get(this.apiUrl + '/figer/' + idSitePrelevement).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
