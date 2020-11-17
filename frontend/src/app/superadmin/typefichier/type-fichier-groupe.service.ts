import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { TypeFichierGroupe } from '@aleaac/shared';

@Injectable({
  providedIn: 'root'
})
export class TypeFichierGroupeService {
  apiUrl: string = environment.api + '/type-fichier-groupe';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TypeFichierGroupe[]> {
    return this.http.get(this.apiUrl).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  add(typeFichierGroupe: TypeFichierGroupe): Observable<TypeFichierGroupe> {
    return this.http.post(this.apiUrl, typeFichierGroupe).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  update(typeFichierGroupe: TypeFichierGroupe): Observable<TypeFichierGroupe> {
    return this.http.put(this.apiUrl, typeFichierGroupe).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }
}
