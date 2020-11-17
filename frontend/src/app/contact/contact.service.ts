import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, share, take } from 'rxjs/operators';
import { Contact } from './Contact';
import { Recherche } from '../resource/query-builder/recherche/Recherche';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {QueryService} from '../resource/query-builder/query.service';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    apiUrl = environment.api + '/contact/';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, modal: boolean, queryBuild: QueryBuild) {
        if (!modal) {
            return this.http.get(this.apiUrl + 'all/' + idFranchise + this.queryService.parseQuery(queryBuild))
                .pipe(
                    map((resp: any) => resp.data),
                    share(), take(1)
                );
        } else {
            return this.http.get(this.apiUrl + 'allFree/' + idFranchise + this.queryService.parseQuery(queryBuild))
                .pipe(
                    map((resp: any) => resp.data),
                    share(), take(1)
                );
        }

    }

    count(idFranchise: number, modal: boolean, recherche: Recherche) {
        let query = '';
        if (recherche.stringRecherche) {
            query = '?' + recherche.stringRecherche;
        }
        if (!modal) {
            return this.http.get(this.apiUrl + 'countAll/' + idFranchise + query)
                .pipe(
                    map((resp: any) => resp.data),
                    share(), take(1)
                );
        } else {
            return this.http.get(this.apiUrl + 'countAllFree/' + idFranchise + query)
                .pipe(
                    map((resp: any) => resp.data),
                    share(), take(1)
                );
        }
    }


    getAllCompte(idCompte: number, queryBuild: QueryBuild) {
        return this.http.get(this.apiUrl + 'allCompte/' + idCompte + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    countAllCompte(idCompte: number, queryBuild: QueryBuild) {
        return this.http.get(this.apiUrl + 'countAllCompte/' + idCompte + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getById(idInterlocuteur: number) {
        return this.http.get(this.apiUrl + idInterlocuteur)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getSecteur(idFranchise: number) {
        return this.http.get(this.apiUrl + 'secteur/' + idFranchise)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    update(interlocuteur: Contact) {
        return this.http.put(this.apiUrl, interlocuteur)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    create(interlocuteur: Contact) {
        return this.http.post(this.apiUrl, interlocuteur)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getWithTarif(id: number) {
        return this.http.get(this.apiUrl + 'with-tarif/' + id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateXlsx(idFranchise: number) {
        return this.http.get(this.apiUrl + 'generate/' + idFranchise, {responseType: 'blob'});
    }
}
