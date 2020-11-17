import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take, catchError} from 'rxjs/operators';
import {QueryService} from '../resource/query-builder/query.service';
import { Fichier } from '../resource/fichier/Fichier';
import { Formation, IFormateurFormation } from '@aleaac/shared';
import { NotificationService } from '../notification/notification.service';
import { ResourceService } from '../resource/resource.service';


@Injectable({
    providedIn: 'root'
})
export class FormateurFormationService {
    apiUrl: string = environment.api + '/formateur-formation';
    

    constructor(
        private http: HttpClient,
        private queryService: QueryService,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
    ) {
    }

    create(data): Observable<IFormateurFormation>{
        const $data = this.http.post(this.apiUrl,data).pipe(
            map((resp:any)=>resp.data)
        );
        return $data.pipe(catchError(this.handleError));
    }

     // getAllByIdFormation(queryBuild: QueryBuild,id: number):Observable<FormationContact[]>{
    //     return this.http.get(this.resourceService.resourcesUrl('formation-contact/')+id+this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp:any) => resp.data)
    //     );
    // }

    // getAllByIdTypeFormation(id: number):Observable<FormationContact[]>{
    //     return this.http.get(this.apiUrl+'/getByIdTypeFormation/'+id).pipe(
    //         map((resp:any)=>resp.data),
    //         share(),take(1)
    //     );
    // }

    // getById(idSession: number,idContact: number):Observable<FormationContact>{
    //     return this.http.get(this.apiUrl+'/getById/'+idSession+'/'+idContact).pipe(
    //         map((resp:any)=>resp.data),
    //         share(),take(1)
    //     );
    // }

    // countAll(queryBuild: QueryBuild,idFormation: number): Observable<number>{
    //     return this.http.get(this.apiUrl+'/countAll/'+idFormation+this.queryService.parseQuery(queryBuild)).pipe(
    //         map((resp:any)=>resp.data),
    //         share(),take(1)
    //     );
    // }

    // update(stagiaire: FormationContact): Observable<FormationContact> {
    //     return <Observable<FormationContact>>this.resourceService.updateResource(stagiaire, 'formation-contact');
    // }

    delete(id: number):Observable<void>{
        return this.resourceService.deleteResource(id,'formateur-formation');
    }

    deleteByIdFormateur(id:number):Observable<void>{
        return this.http.delete(this.apiUrl+'/deleteByIdformateur/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post profil...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }

}
