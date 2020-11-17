import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TypeObjectif } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class TypeObjectifService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createTypeObjectif(typeObjectif: TypeObjectif) {
        return this.http.post(this.apiUrl + '/type-objectif/', typeObjectif).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll() {
        return this.http.get<Observable<TypeObjectif[]>>(this.apiUrl + '/type-objectif').pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }


    remove(profilUtilisateur: TypeObjectif) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/type-objectif/', { "body": profilUtilisateur });
    }
}
