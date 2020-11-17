import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CaptageAspirationSource} from './CaptageAspirationSource';
import {TravailHumide} from './TravailHumide';

@Injectable({
  providedIn: 'root'
})
export class CaptageAspirationSourceService {
  apiUrl: string = environment.api + '/captage-aspiration-source'
  constructor(private http: HttpClient) { }

  getAll(): Observable<CaptageAspirationSource[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

    get(idCaptageAspirationSource): Observable<TravailHumide> {
        return this.http.get(this.apiUrl + '/' + idCaptageAspirationSource).pipe(
            map(
                (reqp: any) => reqp.data
            )
        );
    }
}
