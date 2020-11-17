import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import { IObjectif, Objectif } from '@aleaac/shared';
import {NotificationService} from '../../notification/notification.service';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable( {
    providedIn: 'root'
})
export class ObjectifService {
    constructor(
        @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
        private queryService: QueryService
    ) {}

    createObjectif(objectif: IObjectif): Observable<IObjectif> {
        const $data = this.http
            .post(this.objectifApi, objectif).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getAllObjectif(): Observable<Objectif[]> {
        return <Observable<Objectif[]>>this.resourceService.getResources('objectif');
    }

    getObjectifById(id: number): Observable<Objectif> {
        return <Observable<Objectif>>this.resourceService.getResource(id, 'objectif');
    }

    removeObjectif(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'objectif');
    }

    updateObjectif(objectif: Objectif): Observable<Objectif> {
        return <Observable<Objectif>>this.resourceService.updateResource(objectif, 'objectif');
    }

    countAll(queryBuild: QueryBuild): Observable<number> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('objectif') + '/countAll' + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getPendantTravaux(): Observable<Objectif[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('objectif') + '/get-pendant-travaux')
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getHorsTravaux(): Observable<Objectif[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('objectif') + '/get-hors-travaux')
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getPage(queryBuild: QueryBuild): Observable<Objectif[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('objectif') + '/page/' + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    private get objectifApi(): string {
        return this.apiUrl + '/objectif';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post objectif...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
