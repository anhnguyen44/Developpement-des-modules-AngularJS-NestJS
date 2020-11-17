import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {AffectationPrelevement} from './AffectationPrelevement';
import {map, share, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AffectationPrelevementService {
  apiUrl: string = environment.api + '/affectationPrelevement';
  constructor(private http: HttpClient) { }

  create(affectionPrelevement: AffectationPrelevement): Observable<AffectationPrelevement> {
    console.log(affectionPrelevement);
    return this.http.post(this.apiUrl, affectionPrelevement).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  delete(idAffectationPrelevement: number) {
    return this.http.delete(this.apiUrl + '/' + idAffectationPrelevement).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }
}
