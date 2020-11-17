import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {TypeFormation} from './type-formation/TypeFormation';
import {map, share, take} from 'rxjs/operators';
import { ResourceService } from '../../resource/resource.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { QueryService } from '../../resource/query-builder/query.service';

@Injectable({
  providedIn: 'root'
})
export class TypeFormationService {
  apiUrl: string = environment.api + '/type-formation';

  constructor(
    private http: HttpClient,
    private resourceService: ResourceService,
    private queryService: QueryService    
    ) { }

  getAll(): Observable<TypeFormation[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  getAllQueryBuild(queryBuild: QueryBuild): Observable<TypeFormation[]> {
    return this.http.get(this.apiUrl+'/getAllQueryBuild'+this.queryService.parseQuery(queryBuild)).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }


  getAllPratique(): Observable<TypeFormation[]> {
    return this.http.get(this.apiUrl + '/get-pratique').pipe(
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

  get(id: number): Observable<TypeFormation> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  // getByName(nom: string): Observable<TypeFichier> {
  //   return this.http.get(this.apiUrl + '/getByName/' + nom).pipe(
  //       map((resp: any) => resp.data),
  //       share(), take(1)
  //   );
  // }

  add(typeFormation: TypeFormation): Observable<TypeFormation> {
    return this.http.post(this.apiUrl, typeFormation).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  update(typeFormation: TypeFormation): Observable<TypeFormation> {
      return this.http.put(this.apiUrl, typeFormation).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  delete(id: number): Observable<void>{
    return this.resourceService.deleteResource(id, 'type-formation');
  }
}
