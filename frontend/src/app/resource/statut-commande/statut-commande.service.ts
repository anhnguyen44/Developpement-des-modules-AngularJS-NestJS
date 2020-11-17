import { IStatutCommande, StatutCommande, EnumStatutCommande } from '@aleaac/shared';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, share, take } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import {environment} from '../../../environments/environment';
import {Recherche} from '../query-builder/recherche/Recherche';
import {DevisCommande} from '../../devis-commande/DevisCommande';



@Injectable( {
  providedIn: 'root'
})
export class StatutCommandeService {
  apiURL = environment.api + '/statut-commande';
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  createStatutCommande(statutCommande: IStatutCommande): Observable<IStatutCommande> {
    const $data = this.http
      .post(this.statutCommandeApi, statutCommande).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllStatutCommande(): Observable<StatutCommande[]> {
    return <Observable<StatutCommande[]>>this.resourceService.getResources('statut-commande');
  }

  getStatutCommandeById(id: number): Observable<StatutCommande> {
    return <Observable<StatutCommande>>this.resourceService.getResource(id, 'statut-commande');
  }

  removeStatutCommande(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'statut-commande');
  }

  updateStatutCommande(statutCommande: StatutCommande): Observable<StatutCommande> {
    return <Observable<StatutCommande>>this.resourceService.updateResource(statutCommande, 'statut-commande');
  }

  async statutIsBeforeCommande(idStatut: number): Promise<boolean> {
    const firstCommandeStatus = await this.getStatutCommandeById(EnumStatutCommande.COMMANDE_EN_SAISIE.valueOf()).toPromise();
    const status = await this.getStatutCommandeById(idStatut).toPromise();

    return status.ordre < firstCommandeStatus.ordre;
  }

  countAll(): Observable<number> {
    const $data = this.http
      .get(this.resourceService.resourcesUrl('statut-commande') + '/countAll/')
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  private get statutCommandeApi(): string {
    return this.apiUrl + '/statut-commande';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post statutCommande...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
