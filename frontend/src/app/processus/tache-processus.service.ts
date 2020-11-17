import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TacheProcessus} from './TacheProcessus';
import {map, share, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TacheProcessusService {
  apiUrl: string = environment.api + '/tache-processus';
  constructor(private http: HttpClient) { }

  getAll(idFranchise: number): Observable<TacheProcessus[]> {
    return this.http.get(this.apiUrl + '/getAll/' + idFranchise).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  getByProcessus(idProcessus: number): Observable<TacheProcessus[]> {
    return this.http.get(this.apiUrl + '/getByProcessus/' + idProcessus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  add(tacheProcessus: TacheProcessus): Observable<TacheProcessus> {
    return this.http.post(this.apiUrl, tacheProcessus).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    )
  }
}
