import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MomentObjectif } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class MomentObjectifService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createMomentObjectif(momentObjectif: MomentObjectif) {
        return this.http.post(this.apiUrl + '/moment-objectif/', momentObjectif).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll() {
        return this.http.get<Observable<MomentObjectif[]>>(this.apiUrl + '/moment-objectif').pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }


    remove(profilUtilisateur: MomentObjectif) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/moment-objectif/', { "body": profilUtilisateur });
    }
}
