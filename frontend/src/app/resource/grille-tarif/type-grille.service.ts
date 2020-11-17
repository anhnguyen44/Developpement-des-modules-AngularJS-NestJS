import { TypeGrille } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class TypeGrilleService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createTypeGrille(typeGrille: TypeGrille) {
        return this.http.post(this.apiUrl + '/type-grille/', typeGrille).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll() {
        return this.http.get<Observable<TypeGrille[]>>(this.apiUrl + '/type-grille').pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }


    remove(profilUtilisateur: TypeGrille) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/type-grille/', { 'body': profilUtilisateur });
    }
}
