import { TypeFacturation } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class TypeFacturationService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createTypeFacturation(typeFacturation: TypeFacturation) {
        return this.http.post(this.apiUrl + '/type-facturation/', typeFacturation).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getAll() {
        return this.http.get<Observable<TypeFacturation[]>>(this.apiUrl + '/type-facturation').pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }


    remove(profilUtilisateur: TypeFacturation) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/type-facturation/', { 'body': profilUtilisateur });
    }
}
