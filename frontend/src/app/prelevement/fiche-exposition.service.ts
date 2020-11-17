import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Prelevement} from '../processus/Prelevement';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {FicheExposition} from './FicheExposition';


@Injectable({
  providedIn: 'root'
})
export class FicheExpositionService {
    apiUrl: string = environment.api + '/fiche-exposition';

    constructor(
        private http: HttpClient,
    ) { }

    create(ficheExposition: FicheExposition): Observable<FicheExposition> {
        return this.http.post(this.apiUrl, ficheExposition).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(idFicheExposition: number) {
        return this.http.delete(this.apiUrl + '/' + idFicheExposition).pipe(
            map((resp: any) => resp.data)
        );
    }
}
