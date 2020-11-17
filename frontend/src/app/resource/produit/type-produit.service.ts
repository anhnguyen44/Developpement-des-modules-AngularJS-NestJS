import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Utilisateur, Profil, TypeProduit } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class TypeProduitService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createTypeProduit(typeProduit: TypeProduit) {
        return this.http.post(this.apiUrl + '/type-produit/', typeProduit).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll() {
        return this.http.get<Observable<TypeProduit[]>>(this.apiUrl + '/type-produit').pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }


    remove(profilUtilisateur: TypeProduit) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/type-produit/', { "body": profilUtilisateur });
    }
}
