import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import { ResourceService } from '../../resource/resource.service';
import { DomaineCompetance } from './domaine-competence/DomaineCompentence';

@Injectable({
  providedIn: 'root'
})
export class DomaineCompetenceService {
  apiUrl: string = environment.api + '/domaine-competence';

  constructor(
    private http: HttpClient,
    private resourceService: ResourceService    
    ) { }

  getAll(): Observable<DomaineCompetance[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  // getAffectableByGroupe(id: number): Observable<TypeFichier[]> {
  //   return this.http.get(this.apiUrl + '/affectable-by-groupe/' + id).pipe(
  //       map((resp: any) => resp.data),
  //       share(), take(1)
  //   );
  // }

  // get(id: number): Observable<TypeFichier> {
  //   return this.http.get(this.apiUrl + '/' + id).pipe(
  //       map((resp: any) => resp.data),
  //       share(), take(1)
  //   );
  // }

  // getByName(nom: string): Observable<TypeFichier> {
  //   return this.http.get(this.apiUrl + '/getByName/' + nom).pipe(
  //       map((resp: any) => resp.data),
  //       share(), take(1)
  //   );
  // }

  add(domaineCompetence: DomaineCompetance): Observable<DomaineCompetance> {
    return this.http.post(this.apiUrl, domaineCompetence).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  update(domaineCompetence: DomaineCompetance): Observable<DomaineCompetance> {
      return this.http.put(this.apiUrl, domaineCompetence).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  delete(id: number): Observable<void>{
    return this.resourceService.deleteResource(id, 'domaine-competence');
  }
}
