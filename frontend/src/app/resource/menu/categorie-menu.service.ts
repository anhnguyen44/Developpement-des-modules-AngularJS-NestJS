import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, catchError, share } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ICategorieMenu, CategorieMenu } from '@aleaac/shared';
import { ResourceService } from '../resource.service';
import { NotificationService } from '../../notification/notification.service';
import { QueryBuild } from '../query-builder/QueryBuild';
import { QueryService } from '../query-builder/query.service';

@Injectable({
    providedIn: 'root'
})

export class CategorieMenuService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService,
        private queryService:QueryService
    ) { }

    private get categoriemenuApi(): string{
        return this.apiUrl + '/categorie-menu';
    }
    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post civilite...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
      }

    createCategorieMenu(categoriemenu: ICategorieMenu): Observable<ICategorieMenu> {
      console.log(categoriemenu);
        const $data = this.http
          .post(this.categoriemenuApi, categoriemenu).pipe(
            map((resp: any) => resp.data)
          );
        return $data.pipe(catchError(this.handleError));
      }

    
    getAllCategorieMenu(queryBuild: QueryBuild): Observable<CategorieMenu[]>{
        return this.http.get(this.resourceService.resourcesUrl('categorie-menu') + this.queryService.parseQuery(queryBuild)).pipe(
          map((resp:any) => resp.data)
        );
    }

    getCateById(id: number): Observable<CategorieMenu> {
      return <Observable<CategorieMenu>>this.resourceService.getResource(id, 'categorie-menu');
    }

    getCateParMenuId(menuId: number): Observable<CategorieMenu[]>{
      const $data = this.http
        .get(this.resourceService.resourcesUrl('categorie-menu') + '/cateByMenuId/'+ menuId)
        .pipe(
          map((resp: any) => resp.data),
          share()
        );
      return $data.pipe(
        catchError(this.handleError)
      );
    }

    updateCategorieMenu(cate: CategorieMenu): Observable<CategorieMenu> {
      return <Observable<CategorieMenu>>this.resourceService.updateResource(cate, 'categorie-menu');
    }

    removeCate(id: number): Observable<void> {
      return this.resourceService.deleteResource(id, 'categorie-menu');
    }

}
