import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Historique} from '../historique/Historique';
import {map, share, take} from 'rxjs/operators';
import {Fonction} from './Fonction';

@Injectable({
  providedIn: 'root'
})
export class FonctionService {
  apiUrl = environment.api + '/fonction';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Fonction[]> {
      return this.http.get<Observable<Historique[]>>(this.apiUrl)
          .pipe(
              map((resp: any) => resp.data),
              share(), take(1)
          );
  }
}
