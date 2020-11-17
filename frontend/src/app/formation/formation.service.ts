import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take, catchError} from 'rxjs/operators';
import {QueryService} from '../resource/query-builder/query.service';
import { Fichier } from '../resource/fichier/Fichier';
import { Formation } from '@aleaac/shared';
import { NotificationService } from '../notification/notification.service';
import { ResourceService } from '../resource/resource.service';
import { FormationContact } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})
export class FormationService {
    apiUrl: string = environment.api + '/formation';

    constructor(
        private http: HttpClient,
        private queryService: QueryService,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
    ) {
    }

    create(formation: Formation): Observable<Formation>{
        const $data = this.http.post(this.apiUrl,formation).pipe(
            map((resp:any)=>resp.data)
        );
        return $data.pipe(catchError(this.handleError));
    }

    generateDocumentCoche(text:string,data:any,idSession:number):Observable<Fichier>{
        console.log(data);
        const $data = this.http.post(this.apiUrl + '/generateCoche/'+text+'/'+idSession,data).pipe(
            map((resp: any) => resp.data),
        );
        return $data.pipe(catchError(this.handleError));
    } 

    generateDocument(text: string, idSession: number): Observable<Fichier> {
        const $data = this.http.get(this.apiUrl + '/generate/'+text+'/'+idSession).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
        return $data.pipe(catchError(this.handleError));
    }

    getAll(queryBuild: QueryBuild):Observable<Formation[]>{
        return this.http.get(this.resourceService.resourcesUrl('formation')+this.queryService.parseQuery(queryBuild)).pipe(
            map((resp:any) => resp.data)
        );
    }

    getAllByIdFranchise(id:number,queryBuild:QueryBuild): Observable<Formation[]>{
    const $data = this.http.get(this.apiUrl + '/getAllByIdFranchise/'+id+this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data),
        );
        return $data.pipe(catchError(this.handleError));
    }

    getById(id: number):Observable<Formation>{
        return <Observable<Formation>>this.resourceService.getResource(id,'formation');
    }

    update(formation: Formation):Observable<Formation>{
        return <Observable<Formation>>this.resourceService.updateResource(formation,'formation');
    }

    delete(sesFor: Formation):Observable<void>{
        return this.resourceService.deleteResource(sesFor.id,'formation');
    }

    getTypeFormationNull(id: number):Observable<void>{
        const $data = this.http.get(this.apiUrl + '/typeFormaNull/'+id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
        return $data.pipe(catchError(this.handleError));
    }


    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post profil...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }

}
