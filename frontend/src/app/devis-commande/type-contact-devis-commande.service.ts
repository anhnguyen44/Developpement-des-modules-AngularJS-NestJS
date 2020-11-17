import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TypeContactDevisCommande} from './TypeContactDevisCommande';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TypeContactDevisCommandeService {
  apiUrl = environment.api + '/type-contact-devis-commande';
  constructor(private http: HttpClient) { }

  getAll(): Observable<TypeContactDevisCommande[]> {
    return this.http.get(this.apiUrl + '/').pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }
}
