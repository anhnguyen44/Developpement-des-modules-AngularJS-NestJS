import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';

import {map, share, take} from 'rxjs/operators';
import { FonctionRH } from './FonctionRessourceHumaine';
import { IFonctionRH } from '@aleaac/shared';


@Injectable({
  providedIn: 'root'
})
export class RessourceHumaineFonctionService {

    apiUrl = environment.api + '/rh-fonction';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    // getAll(idFranchise: number, queryBuild: QueryBuild): Observable<RessourceHumaine[]> {
    //     return this.http.get(this.apiUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    // countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
    //     return this.http.get(this.apiUrl + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    // getByBureau(idBureau: number, queryBuild: QueryBuild): Observable<RessourceHumaine[]> {
    //     return this.http.get(this.apiUrl + '/getByBureau/' + idBureau + this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    // countByBureau(idBureau: number, queryBuild: QueryBuild): Observable<number> {
    //     return this.http.get(this.apiUrl + '/countByBureau/' + idBureau + this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    // get(idRessourceHumaine: number): Observable<RessourceHumaine> {
    //     return this.http.get(this.apiUrl + '/' + idRessourceHumaine).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    getAllFormateur():Observable<FonctionRH[]>{
        return this.http.get(this.apiUrl + '/getAllFormateur').pipe(
            map((resp: any)=> resp.data)
        );
    }

    getFormateurByIdTypeFormation(id: number):Observable<FonctionRH[]>{
        return this.http.get(this.apiUrl + '/getFormateurByIdTypeFormation/'+id).pipe(
            map((resp: any)=> resp.data)
        );
    }

    getFormateurByIdTypeFormationParFranchise(idTypeForma: number,idFranchise: number){
        return this.http.get(this.apiUrl + '/getFormateurByIdTypeFormationParFranchise/'+idTypeForma+'/'+idFranchise).pipe(
            map((resp: any)=> resp.data)
        );
    }

    create(rhFonction: FonctionRH): Observable<FonctionRH> {
        console.log(this.apiUrl);
        console.log(rhFonction);
        return this.http.post(this.apiUrl, rhFonction).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    // update(ressourceHumaine: RessourceHumaine): Observable<RessourceHumaine> {
    //     return this.http.put(this.apiUrl, ressourceHumaine).pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    // addRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine) {
    //     return this.http.post(this.apiUrl + '/rendezVousRessourceHumaine', rendezVousRessourceHumaine).pipe(
    //         map((resp: any) => resp.data)
    //     );
    // }

    // removeRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine) {
    //     return this.http.delete(this.apiUrl + '/rendezVousRessourceHumaine/' + rendezVousRessourceHumaine.id);
    // }

    deleteByIdRh(id: number):  Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdRh/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }
}
