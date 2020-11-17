import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Mpca} from './Mpca';
import {map, share, take} from 'rxjs/operators';
import {OutilTechnique} from './OutilTechnique';

@Injectable({
  providedIn: 'root'
})
export class MpcaService {
  apiUrl: string = environment.api + '/mpca';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Mpca[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

    get(idMpca): Observable<Mpca> {
        return this.http.get(this.apiUrl + '/' + idMpca).pipe(
            map(
                (reqp: any) => reqp.data
            )
        );
    }
}
