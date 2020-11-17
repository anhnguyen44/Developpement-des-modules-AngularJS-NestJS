import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';
import { MateriauConstructionAmianteService } from '../materiau-construction-amiante/materiau-construction-amiante.service';
import { IListe, Liste, ListeVerifExistenceDto } from '@aleaac/shared';
import { Observable } from 'rxjs/internal/Observable';
import { NEVER, EMPTY, of } from 'rxjs';
import { EnumTypePartageListe } from '@aleaac/shared';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class ListeService {
    apiUrl = environment.api;
    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private notificationService: NotificationService,
    ) { }

    create(listItem: IListe): Observable<Liste> {
        const $data = this.http
            .post(this.listeApi, listItem).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }


    createIfNeeded(valeur: string, liste: Liste[], idFranchise: number | null = null): Observable<Liste> {

        if (liste && liste.length) {
            const tmpList = liste.find(l => l.valeur === valeur);

            if (!tmpList) {
                const nouvelItem = new Liste();
                nouvelItem.isLivreParDefaut = false;
                nouvelItem.nomListe = liste[0].nomListe;
                nouvelItem.ordre = liste.length + 1;

                if (liste[0].typePartage === EnumTypePartageListe.Franchise) {
                    nouvelItem.idFranchise = idFranchise;
                }
                const limit = 50;
                const trail = '...';
                nouvelItem.resume = valeur.length > limit
                    ? valeur.substring(0, limit) + trail
                    : valeur;
                nouvelItem.valeur = valeur;
                nouvelItem.typePartage = liste[0].typePartage;

                return this.create(nouvelItem);
            } else {
                return of(tmpList);
            }
        } else {
            return EMPTY;
        }
    }

    getAll() {
        const $data = this.http
            .get(this.listeApi)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getByListName(nom: string) {
        const $data = this.http
            .get(this.listeApi + '/getAll/' + nom)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getById(id: number) {
        const $data = this.http
            .get(this.listeApi + '/' + id)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    generateXlsx() {
        return this.http.get(this.listeApi + '/generateXlsx/', { responseType: 'blob' }).pipe(share(), take(1));
    }

    verifExistence(item: Liste) {
        const dto = new ListeVerifExistenceDto();
        dto.nomListe = item.nomListe;
        dto.valeur = item.valeur;
        const $data = this.http
            .post(this.listeApi + '/verif-existence', dto)
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    truncate() {
        const $data = this.http
            .post(this.listeApi + '/truncate', {})
            .pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    private get listeApi(): string {
        return this.apiUrl + '/liste';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post liste...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
