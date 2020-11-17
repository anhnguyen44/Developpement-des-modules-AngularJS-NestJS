import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {IDroit} from '@aleaac/shared';
import {Droit} from './Droit';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../notification/notification.service';
import {Recherche} from '../query-builder/recherche/Recherche';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class DroitService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService,
        private queryService: QueryService
    ) {
    }

    createDroit(droit: IDroit): Observable<Droit> {
        const $data = this.http
            .post(this.droitApi, droit).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getAllDroit(): Observable<Droit[]> {
        return <Observable<Droit[]>>this.resourceService.getResources('droit');
    }

    getDroitById(id: number): Observable<Droit> {
        return <Observable<Droit>>this.resourceService.getResource(id, 'droit');
    }

    getDroitForMenu(): Observable<Droit[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('droit') + '/droitformenu')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    removeDroit(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'droit');
    }

    updateDroit(droit: Droit): Observable<Droit> {
        return <Observable<Droit>>this.resourceService.updateResource(droit, 'droit');
    }

    countAll(queryBuild: QueryBuild): Observable<number> {

        const $data = this.http
            .get(this.resourceService.resourcesUrl('droit') + '/countAll' + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getPage(queryBuild: QueryBuild): Observable<Droit[]> {

        const $data = this.http
            .get(this.resourceService.resourcesUrl('droit') + '/page/' + this.queryService.parseQuery(queryBuild))
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    private get droitApi(): string {
        return this.apiUrl + '/droit';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post droit...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
