import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TravailHumide} from './TravailHumide';

@Injectable({
  providedIn: 'root'
})
export class TravailHumideService {
  apiUrl: string = environment.api + '/travail-humide';
  constructor(private http: HttpClient) { }

  getAll(): Observable<TravailHumide[]> {
    return this.http.get(this.apiUrl).pipe(
        map(
            (reqp: any) => reqp.data
        )
    );
  }

  get(idTravailHumide): Observable<TravailHumide> {
      return this.http.get(this.apiUrl + '/' + idTravailHumide).pipe(
          map(
              (reqp: any) => reqp.data
          )
      );
  }
}
