import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { IStrategie } from '@aleaac/shared';
import { Strategie } from './Strategie';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';
import { InitStrategieFromBesoinDto } from '@aleaac/shared/src/dto/chantier/initStrategiesFromBesoin.dto';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class StrategieService {
    apiUrl = environment.api;
    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService
    ) { }

    createStrategie(strategie: IStrategie): Observable<Strategie> {
        const $data = this.http
            .post(this.strategieApi, strategie).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getAllStrategie(): Observable<Strategie[]> {
        return <Observable<Strategie[]>>this.resourceService.getResources('strategie');
    }

    getStrategieById(id: number): Observable<Strategie> {
        return <Observable<Strategie>>this.resourceService.getResource(id, 'strategie');
    }

    getSS3ByChantier(idChantier: number): Observable<Strategie[]> {
        const $data = this.http
            .get(this.strategieApi + '/getSS3/' + idChantier).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getSS4ByChantier(idChantier: number): Observable<Strategie[]> {
        const $data = this.http
            .get(this.strategieApi + '/getSS4/' + idChantier).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getCSPByChantier(idChantier: number): Observable<Strategie[]> {
        const $data = this.http
            .get(this.strategieApi + '/getCSP/' + idChantier).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    initFromBesoin(dto: InitStrategieFromBesoinDto) {
        const $data = this.http
            .post(this.apiUrl + '/besoin-client-labo/initStrategiesFromBesoin', dto).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    removeStrategie(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'strategie');
    }

    updateStrategie(strategie: Strategie): Observable<Strategie> {
        return <Observable<Strategie>>this.resourceService.updateResource(strategie, 'strategie');
    }

    private get strategieApi(): string {
        return this.apiUrl + '/strategie';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post strategie...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
