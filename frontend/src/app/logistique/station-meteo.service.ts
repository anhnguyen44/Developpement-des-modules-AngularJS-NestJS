import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {QueryService} from '../resource/query-builder/query.service';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {Consommable} from './Consommable';
import {map, share, take} from 'rxjs/operators';
import {StationMeteo} from './StationMeteo';

@Injectable({
  providedIn: 'root'
})
export class StationMeteoService {aipUrl = environment.api + '/station-meteo';
    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise: number, queryBuild: QueryBuild): Observable<StationMeteo[]> {
        return this.http.get(this.aipUrl + '/getAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    countAll(idFranchise: number, queryBuild: QueryBuild): Observable<number> {
        return this.http.get(this.aipUrl + '/countAll/' + idFranchise + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    get(idStationMeteo: number) {
        return this.http.get(this.aipUrl + '/' + idStationMeteo).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    create(stationMeteo: StationMeteo) {
        return this.http.post(this.aipUrl, stationMeteo).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(stationMeteo: StationMeteo) {
        return this.http.put(this.aipUrl, stationMeteo);
    }
}
