import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OutilTechnique} from './OutilTechnique';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {TravailHumide} from './TravailHumide';

@Injectable({
  providedIn: 'root'
})
export class OutilTechniqueService {
  apiUrl: string = environment.api + '/outil-technique';
  constructor(private http: HttpClient) { }

  getAll(): Observable<OutilTechnique[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

    get(idOutilTechnique): Observable<OutilTechnique> {
        return this.http.get(this.apiUrl + '/' + idOutilTechnique).pipe(
            map(
                (reqp: any) => reqp.data
            )
        );
    }
}
