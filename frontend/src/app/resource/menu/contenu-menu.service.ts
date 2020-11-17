import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiUrl} from '../api-url';
import {Observable, BehaviorSubject} from 'rxjs';
import {map, catchError, share} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {IContenuMenu, ContenuMenu} from '@aleaac/shared';
import {ResourceService} from '../resource.service';
import {NotificationService} from '../../notification/notification.service';
import {QueryBuild} from '../query-builder/QueryBuild';
import {QueryService} from '../query-builder/query.service';

@Injectable({
    providedIn: 'root'
})

export class ContenuMenuService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService,
        private queryService: QueryService,
    ) {
    }

    private get contenumenuApi(): string {
        return this.apiUrl + '/contenu-menu';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post civilite...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }

    createContenuMenu(contenumenu: ContenuMenu): Observable<ContenuMenu> {
        console.log(contenumenu);
        const $data = this.http
            .post(this.contenumenuApi, contenumenu).pipe(
                map((resp: any) => resp.data)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getAllContenus(queryBuild: QueryBuild): Observable<ContenuMenu[]> {
        return this.http.get(this.resourceService.resourcesUrl('contenu-menu') + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }


    getAllContenusVisible(queryBuild: QueryBuild): Observable<ContenuMenu[]> {
        return this.http.get(this.resourceService.resourcesUrl('contenu-menu') + '/visible' + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    getContenuById(id: number): Observable<ContenuMenu> {
        return <Observable<ContenuMenu>>this.resourceService.getResource(id, 'contenu-menu');
    }

    getContenuByExpressName(express: string): Observable<ContenuMenu> {
        const data = this.http.get(this.resourceService.resourcesUrl('contenu-menu') + '/article/' + express)
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return data.pipe(
            catchError(this.handleError)
        );
    }

    getContenusByMenuId(id: number): Observable<ContenuMenu[]> {
        const data = this.http.get(this.resourceService.resourcesUrl('contenu-menu') + '/liste/' + id)
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return data.pipe(
            catchError(this.handleError)
        );
    }

    removeContenu(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'contenu-menu');
    }

    updateContenuMenu(contenu: ContenuMenu): Observable<ContenuMenu> {
        return <Observable<ContenuMenu>>this.resourceService.updateResource(contenu, 'contenu-menu');
    }

    getContenusByMenuId2(idMenu: number, queryBuild: QueryBuild): Observable<ContenuMenu[]> {

        return this.http.get(this.apiUrl + '/contenu-menu/all/' + idMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    getContenusByUrl(url: string, queryBuild: QueryBuild): Observable<ContenuMenu[]> {

        return this.http.get(this.apiUrl + '/contenu-menu/allUrl' + url + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }


    getContenuParentRecher(): Observable<ContenuMenu[]> {
        return this.http.get(this.resourceService.resourcesUrl('contenu-menu') + '/allParentRecher').pipe(
            map((resp: any) => resp.data)
        );
    }

    getListElastic(idMenu: number, queryBuild: QueryBuild): Observable<string[]> {

        return this.http.get(this.apiUrl + '/contenu-menu/elasticSearch/' + idMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    getListElasticUrl(url: string, queryBuild: QueryBuild): Observable<string[]> {

        return this.http.get(this.apiUrl + '/contenu-menu/elasticSearchUrl' + url + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    countElas(idMenu: number, queryBuild: QueryBuild): Observable<number> {

        return this.http.get(this.apiUrl + '/contenu-menu/countElasticSearch/' + idMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    countAll(idMenu: number, queryBuild: QueryBuild): Observable<number> {

        return this.http.get(this.apiUrl + '/contenu-menu/countAll/' + idMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    countAllUrl(urlMenu: string, queryBuild: QueryBuild): Observable<number> {

        return this.http.get(this.apiUrl + '/contenu-menu/countAllUrl/' + urlMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    countElasByUrl(urlMenu: string, queryBuild: QueryBuild): Observable<number> {

        return this.http.get(this.apiUrl + '/contenu-menu/countElasticSearchUrl/' + urlMenu + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    /*
    reindexerArticle(Contenu: ContenuMenu): Observable<ContenuMenu> {
        return this.http.patch(this.apiUrl + '/contenu-menu/reindex/' , Contenu).pipe(
          map((resp: any) => resp.data)
      );
      }*/

    reindexerArticle() {
        return this.http.get(this.apiUrl + '/contenu-menu/reindex/all');
    }

}
