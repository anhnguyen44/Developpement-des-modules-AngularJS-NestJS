import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, share, take } from 'rxjs/operators';
import { Recherche } from '../../resource/query-builder/recherche/Recherche';
import { QueryService } from '../../resource/query-builder/query.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';

@Injectable({
    providedIn: 'root'
})
export class BureauService {
    apiUrl = environment.api + '/bureau';

    constructor(
        private http: HttpClient,
        private queryService: QueryService
    ) { }

    getAll(idFranchise, queryBuild?: QueryBuild) {
        return this.http.get(this.apiUrl + '/all/' + idFranchise + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getAllPricipal(idFranchise, queryBuild?: QueryBuild) {
        return this.http.get(this.apiUrl + '/allPrici/' + idFranchise + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    getById(idBureau) {
        // console.log(idBureau);
        return this.http.get(this.apiUrl + '/' + idBureau)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    create(bureau) {
        return this.http.post(this.apiUrl, bureau).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    update(bureau) {
        return this.http.put(this.apiUrl, bureau).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + '/' + id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    generateXlsx() {
        return this.http.get(this.apiUrl + '/generateXlsx/', { responseType: 'blob' });
    }
}
