import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { map, tap, share, take } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { InfosBesoinClientLabo } from '@aleaac/shared';

@Injectable({
  providedIn: 'root'
})
export class InformationsBesoinService {
  apiUrl: string = environment.api + '/infos-besoin-client-labo';
  constructor(private http: HttpClient) { }

  getAll(idParent: number): Observable<InfosBesoinClientLabo[]> {
    return this.http.get(this.apiUrl + '/by-besoin/' + idParent).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  save(formData: InfosBesoinClientLabo): Observable<InfosBesoinClientLabo> {
    return this.http.post(this.apiUrl, formData).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  updateComment(formData: InfosBesoinClientLabo): Observable<InfosBesoinClientLabo> {
    return this.http.patch(this.apiUrl + '/update-comment', formData).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  delete(fichier) {
    return this.http.delete(this.apiUrl + '/' + fichier.id);
  }
}
