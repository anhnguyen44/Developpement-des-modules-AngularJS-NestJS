import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Utilisateur, Profil, TypeMenu, ITypeMenu } from '@aleaac/shared';
import { ResourceService } from '../resource.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
    providedIn: 'root'
})

export class TypeMenuService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService
    ) { }

    private get typemenuApi(): string{
        return this.apiUrl + '/typemenu';
    }
    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post civilite...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'Une erreur est survenue.';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
      }

    // createTypeMenu(typemenu: ITypeMenu): Observable<ITypeMenu> {
    //     const $data = this.http
    //       .post(this.typemenuApi, {
    //         typemenu: typemenu
    //       }).pipe(
    //         map((resp: any) => resp.data)
    //       );
    //     return $data.pipe(catchError(this.handleError));
    //   }

    
    getAllTypeMenu(): Observable<ITypeMenu[]>{
        return <Observable<ITypeMenu[]>>this.resourceService.getResources('type-menu');

    }
}
