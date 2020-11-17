import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {TypeFichier} from './type-fichier/TypeFichier';
import {map, share, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TypeFichierService {
  apiUrl: string = environment.api + '/type-fichier';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TypeFichier[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  getAffectableByGroupe(id: number): Observable<TypeFichier[]> {
    return this.http.get(this.apiUrl + '/affectable-by-groupe/' + id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  get(id: number): Observable<TypeFichier> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  getByName(nom: string): Observable<TypeFichier> {
    return this.http.get(this.apiUrl + '/getByName/' + nom).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  add(typeFichier: TypeFichier): Observable<TypeFichier> {
    return this.http.post(this.apiUrl, typeFichier).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

    update(typeFichier: TypeFichier): Observable<TypeFichier> {
        return this.http.put(this.apiUrl, typeFichier).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }
}
