import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';
import { MateriauConstructionAmianteService } from '../materiau-construction-amiante/materiau-construction-amiante.service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class ImportService {
    apiUrl = environment.api;
    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private notificationService: NotificationService,
        private materiauConstructionAmianteService: MateriauConstructionAmianteService,
    ) { }


    getDataFromFile(idFichier: number, hasHeaders: boolean, headers: Array<string> = []) {
        const $data = this.http
            .post(this.importApi, { idFichier: idFichier, hasHeaders: hasHeaders, headers: headers })
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    private get importApi(): string {
        return this.apiUrl + '/import';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post import...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
