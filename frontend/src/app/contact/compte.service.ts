import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Compte} from './Compte';
import {environment} from '../../environments/environment';
import {map, share, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Recherche} from '../resource/query-builder/recherche/Recherche';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  apiUrl = environment.api + '/contact/compte/';
  constructor(
      private http: HttpClient,
      private queryService: QueryService
  ) { }

  getAll(idFranchise, queryBuild: QueryBuild): Observable<Compte[]> {
      const query = this.queryService.parseQuery(queryBuild);
      console.log(query);
      return this.http.get(this.apiUrl + 'all/' + idFranchise + query).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

  countAll(idFranchise: number, recherche: Recherche): Observable<number> {
      let query = '';
      if (recherche.stringRecherche) {
          query = '?' + recherche.stringRecherche;
      }
      return this.http.get(this.apiUrl + 'countAll/' + idFranchise + query).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
  }

    getById(idCompte: number) {
        return this.http.get(this.apiUrl + idCompte)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    update(compte: Compte) {
        return this.http.put(this.apiUrl, compte)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    create(compte: Compte) {
        return this.http.post(this.apiUrl, compte)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getWithTarif(id: number) {
      return this.http.get(this.apiUrl + 'with-tarif/' + id).pipe(
          map((resp: any) => resp.data),
          share(), take(1)
      );
    }

    delete(compte: Compte) {
      return this.http.delete(this.apiUrl + compte.id);
    }

    generateXlsx(idFranchise: number) {
        return this.http.get(this.apiUrl + 'generate/' + idFranchise, {responseType: 'blob'});
    }
}
