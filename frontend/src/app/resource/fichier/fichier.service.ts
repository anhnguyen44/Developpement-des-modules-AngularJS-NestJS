import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Fichier } from './Fichier';
import { map, tap, share, take } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { ResourceService } from '../resource.service';
import { IFichier } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})
export class FichierService {
    apiUrl: string = environment.api + '/fichier';
    constructor(private http: HttpClient,
        private resourceService: ResourceService, ) { }

    getAll(application: string, idParent: number): Observable<Fichier[]> {
        return this.http.get(this.apiUrl + '/' + application + '/' + idParent).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    getFichierById(id: number): Observable<Fichier> {
        return this.http.get(this.apiUrl + '/getById/' + id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    save(formData: FormData): Observable<Fichier> {
        return this.http.post(this.apiUrl, formData).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    saveResize(formData: FormData, width: number, height: number, fit: string = 'inside'): Observable<Fichier> {
        return this.http.post(this.apiUrl + '/create-resize/' + width + '/' + height + '/' + fit, formData).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    saveForceCreate(formData: FormData, ): Observable<Fichier> {
        return this.http.post(this.apiUrl + '/create-force', formData).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    updateComment(formData: FormData): Observable<Fichier> {
        return this.http.patch(this.apiUrl + '/update-comment', formData).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    updateIdParent(fichier: Fichier): Observable<Fichier> {
        return <Observable<Fichier>>this.resourceService.updateResource(fichier, 'fichier');
    }

    get(keyDL: string): Observable<Blob> {
        return this.http.get(this.apiUrl + '/affiche/' + keyDL, { responseType: 'blob' }).pipe(share(), take(1));
    }

    affiche(keyDL: string): Observable<Blob> {
        return this.http.get(this.apiUrl + '/affiche/' + keyDL, { responseType: 'blob' }).pipe(share(), take(1));
    }

    delete(fichier) {
        return this.http.delete(this.apiUrl + '/' + fichier.id).pipe(share(), take(1));
    }
}
