import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {QueryBuild} from '../resource/query-builder/QueryBuild';
import {Observable} from 'rxjs';
import {map, share, take, catchError} from 'rxjs/operators';
import {QueryService} from '../resource/query-builder/query.service';
import { Fichier } from '../resource/fichier/Fichier';
import { Formation, NoteCompetenceStagiaire } from '@aleaac/shared';
import { NotificationService } from '../notification/notification.service';
import { ResourceService } from '../resource/resource.service';
import { FormationContact } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})
export class NoteCompetenceStagiaireService {
    apiUrl: string = environment.api + '/note-competence-stagiaire';
    

    constructor(
        private http: HttpClient,
        private queryService: QueryService,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
    ) {
    }

    create(note: any): Observable<NoteCompetenceStagiaire>{
        const $data = this.http.post(this.apiUrl,note).pipe(
            map((resp:any)=>resp.data)
        );
        return $data.pipe(catchError(this.handleError));
    }

    getAllByIdStagiaire(id: number):Observable<NoteCompetenceStagiaire[]>{
        return this.http.get(this.apiUrl+'/getAllByIdSta/'+id).pipe(
            map((resp:any) => resp.data)
        );
    }

    getAllByIdTypeForma(id: number):Observable<NoteCompetenceStagiaire[]>{
        return this.http.get(this.apiUrl+'/getAllByIdTypeForma/'+id).pipe(
            map((resp:any) => resp.data)
        );
    }
    

    // getById(idSession: number,id: number):Observable<FormationContact>{
    //     return this.http.get(this.apiUrl+'/getById/'+idSession+'/'+id).pipe(
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

    update(note): Observable<NoteCompetenceStagiaire> {
        return <Observable<NoteCompetenceStagiaire>>this.resourceService.updateResource(note, 'note-competence-stagiaire');
    }

    // delete(id: number):Observable<void>{
    //     return this.resourceService.deleteResource(id,'formation-contact');
    // }

    deleteByIdNote(id: number):  Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdNote/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }

    deleteAllNoteByIdSta(id):Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdSta/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }
    
    deleteByIdCompetence(id):Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdCom/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }

    deleteAllNoteByIdTypeFormation(id: number):  Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdTypeForma/'+id).pipe(
            map((resp: any) => resp.data)
        );
    }

    deleteAllNoteByIdFormation(id: number):  Observable<void>{
        console.log(id);
        return this.http.delete(this.apiUrl+'/deleteByIdForma/'+id).pipe(
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
