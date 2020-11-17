import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { ResourceService } from '../../resource/resource.service';
import { TypeFormationDCompetence } from '@aleaac/shared';

@Injectable({
  providedIn: 'root'
})
export class TFormationDCompetenceService {
  apiUrl: string = environment.api + '/tFormation-dCompetence';

  constructor(
    private http: HttpClient,
    private resourceService: ResourceService
  ) { }

  getAll(): Observable<TypeFormationDCompetence[]> {
    return this.http.get(this.apiUrl).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  getByIdTypeFormation(id: number): Observable<TypeFormationDCompetence[]> {
    return this.http.get(this.apiUrl + '/getByIdTypeFormation/' + id).pipe(
      map((resp: any) => resp.data)
    );
  }

  getByIdCompetence(id: number): Observable<TypeFormationDCompetence[]> {
    return this.http.get(this.apiUrl + '/getByIdCompetence/' + id).pipe(
      map((resp: any) => resp.data)
    );
  }

  add(typeFormation): Observable<TypeFormationDCompetence> {
    return this.http.post(this.apiUrl, typeFormation).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  update(typeFormation: TypeFormationDCompetence): Observable<TypeFormationDCompetence> {
    return this.http.put(this.apiUrl, typeFormation).pipe(
      map((resp: any) => resp.data),
      share(), take(1)
    );
  }

  delete(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'tFormation-dCompetence');
  }

  deleteByIdFormation(id: number): Observable<void> {
    console.log(id);
    return this.http.delete(this.apiUrl + '/deleteByIdForma/' + id).pipe(
      map((resp: any) => resp.data)
    );
  }

  deleteByIdCompetence(id: number): Observable<void> {
    console.log(id);
    return this.http.delete(this.apiUrl + '/deleteByIdCompetence/' + id).pipe(
      map((resp: any) => resp.data)
    );
  }
}
