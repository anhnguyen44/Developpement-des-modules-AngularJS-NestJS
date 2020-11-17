import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Categorie} from './Categorie';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map, share, catchError, take} from 'rxjs/operators';
import { ResourceService } from '../resource/resource.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  apiUrl = environment.api + '/categorie';
  constructor(
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService
    ) { }

  getAll(): Observable<Categorie[]> {
    return this.http.get(this.apiUrl).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
    );
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post profil...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
