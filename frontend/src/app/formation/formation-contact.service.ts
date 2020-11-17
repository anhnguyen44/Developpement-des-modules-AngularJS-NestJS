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
export class FormationContactService {
    apiUrl: string = environment.api + '/formation-contact';
    

    constructor(
        private http: HttpClient,
        private queryService: QueryService,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
    ) {
    }

    create(stagiaire: FormationContact): Observable<FormationContact>{
        const $data = this.http.post(this.apiUrl,stagiaire).pipe(
            map((resp:any)=>resp.data)
        );
        return $data.pipe(catchError(this.handleError));
    }

    // generateDocument(): Observable<Fichier> {
    //     return this.http.get(this.apiUrl + '/generate').pipe(
    //         map((resp: any) => resp.data),
    //         share(), take(1)
    //     );
    // }

    countAll(queryBuild: QueryBuild,idFormation: number): Observable<number>{
        return this.http.get(this.apiUrl+'/countAll/'+idFormation+this.queryService.parseQuery(queryBuild)).pipe(
            map((resp:any)=>resp.data),
            share(),take(1)
        );
    }

    

    delete(id: number):Observable<void>{
        return this.resourceService.deleteResource(id,'formation-contact');
    }
    
    update(stagiaire: FormationContact): Observable<FormationContact> {
        return <Observable<FormationContact>>this.resourceService.updateResource(stagiaire, 'formation-contact');
    }

    getById(idSession: number,idContact: number):Observable<FormationContact>{
        return this.http.get(this.apiUrl+'/getById/'+idSession+'/'+idContact).pipe(
            map((resp:any)=>resp.data),
            share(),take(1)
        );
    }

    getAllByIdFormation(queryBuild: QueryBuild,id: number):Observable<FormationContact[]>{
        return this.http.get(this.resourceService.resourcesUrl('formation-contact/')+id+this.queryService.parseQuery(queryBuild)).pipe(
            map((resp:any) => resp.data)
        );
    }

    getAllByIdDevis(id: number):Observable<FormationContact[]>{
        return this.http.get(this.apiUrl+'/getAllByIdDevis/'+id).pipe(
            map((resp:any)=>resp.data),
            share(),take(1)
        );
    }
    getAllByIdTypeFormation(id: number):Observable<FormationContact[]>{
        return this.http.get(this.apiUrl+'/getByIdTypeFormation/'+id).pipe(
            map((resp:any)=>resp.data),
            share(),take(1)
        );
    }

    

    

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post profil...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }

}
