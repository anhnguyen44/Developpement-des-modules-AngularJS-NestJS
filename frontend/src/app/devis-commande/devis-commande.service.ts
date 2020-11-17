import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, share, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DevisCommande } from './DevisCommande';
import { Fichier } from '../resource/fichier/Fichier';
import { QueryService } from '../resource/query-builder/query.service';
import { QueryBuild } from '../resource/query-builder/QueryBuild';
import {ContactDevisCommande} from './ContactDevisCommande';
import {TypeContactDevisCommande} from './TypeContactDevisCommande';

@Injectable({
    providedIn: 'root'
})
export class DevisCommandeService {
    apiUrl = environment.api + '/devis-commande';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    get(idDevisCommande: number): Observable<DevisCommande> {
        return this.http.get(this.apiUrl + '/' + idDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<DevisCommande[]> {

        return this.http.get(this.apiUrl + '/all/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAllByIdFormation(idFormation:number, idFranchise: number, queryBuild: QueryBuild): Observable<DevisCommande[]> {

        return this.http.get(this.apiUrl + '/allByIdFormation/' + idFormation + '/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
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

    create(devisCommande: DevisCommande): Observable<DevisCommande> {
        return this.http.post(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    initFromChantier(devisCommande: DevisCommande): Observable<DevisCommande> {
        return this.http.post(this.apiUrl + '/init-from-chantier/' + devisCommande.idChantier, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(devisCommande: DevisCommande) {
        return this.http.put(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    partialUpdate(devisCommande: DevisCommande) {
        return this.http.patch(this.apiUrl, devisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(idDevisCommande: number) {
        return this.http.delete(this.apiUrl + '/' + idDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    imprimer(idDevisCommande: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/generate/' + idDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    imprimerTest(idDevisCommande: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/generate-test/' + idDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    deleteInterlocuteur(contactDevisCommande: ContactDevisCommande): Observable<void> {
        return this.http.delete(this.apiUrl + '/deleteInterlocuteur/' + contactDevisCommande.id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    figer(idDevisCommande: number): Observable<DevisCommande> {
        return this.http.get(this.apiUrl + '/figer/' + idDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    addContact(contactDevisCommande): Observable<void> {
        return this.http.post(this.apiUrl + '/addContact', contactDevisCommande).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateXlsx(idFranchise: number) {
        return this.http.get(this.apiUrl + '/generateXlsx/' + idFranchise, {responseType: 'blob'});
    }
}
