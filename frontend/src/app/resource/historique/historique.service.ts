import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Historique} from './Historique';
import {Observable} from 'rxjs';
import {map, share, take} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {UserStore} from '../user/user.store';
import {QueryService} from '../query-builder/query.service';

@Injectable({
  providedIn: 'root'
})

export class HistoriqueService {
    apiUrl = environment.api;

    constructor(
      // @Inject(ApiUrl) private apiUrl: string,
      private http: HttpClient,
        private userStore: UserStore,
        private queryService: QueryService
    ) { }

    countByApplication(application, idParent) {
    return this.http.get<Observable<Historique[]>>(this.apiUrl + '/historique/count/' + application + '/' + idParent)
        .pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getByApplication(application, idParent, queryBuild) {
        let query = this.queryService.parseQuery(queryBuild);
        return this.http.get<Observable<Historique[]>>
        (this.apiUrl + '/historique/' + application + '/' + idParent + '/' + query).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    setHistorique(idParent, application, description) {
        this.userStore.user.subscribe((user) => {
            const historique = new Historique(user.id, new Date(), idParent, application, description);
            console.log(historique);
            return this.createHistorique(historique);
        });
    }

    createHistorique(historique: Historique) {
      return this.http.post(this.apiUrl + '/historique/', historique).pipe(share(), take(1));
    }
}
