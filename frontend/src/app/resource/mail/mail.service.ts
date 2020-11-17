import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


import {ApiUrl} from '../api-url';
import {ResourceService} from '../resource.service';
import {map, catchError, share, take} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {NotificationService} from '../../notification/notification.service';
import {Mail, MailFile} from '@aleaac/shared';

@Injectable( {
  providedIn: 'root'
})
export class MailService {
  constructor(
    @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private notificationService: NotificationService,
    private resourceService: ResourceService
  ) {}

  send(email: Mail): Observable<string> {
    console.log(email);
    const $data = this.http
      .post(this.resourceService.resourcesUrl('mail') + '/send/', email)
      .pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(
      catchError(this.handleError)
    );
  }

  sendTest() {
    // On met toutes les valeurs à remplacer (clef/valeur) dans le template
    const data: Map<string, string> = new Map<string, string>();
    data.set('data', '<h1>Hello World !</h1>');

    // On convertit en objet pour le transfer par POST, sinon ça envoie vide
    const convMap = {};
    data.forEach((val: string, key: string) => {
    convMap[key] = val;
    });

    // On définit les paramètres du mail
      const totoFile: MailFile = {
          filename: 'test.png',
              path: './src/mail/template/logo-alea-controles.png', // chemin absolu ou par rapport au backend
          selected: true
      }
    const toto: Mail = {
        from: 'ykc@diagamter.com',
        to: ['yohan-kevin.company@diagamter.com'],
        subject: 'Mail De Test',
        template: 'blank', // Fichier HTML à créer dans le backend dans le dossier src/mail/template
        cc: ['nicolas.colomer@diagamter.com'],
        cci: ['yohann.moustier@diagamter.com'],
        dataList: convMap,
        attachments: [totoFile]
    };
    return this.send(toto);
  }

  private get mailApi(): string {
    return this.apiUrl + '/mail';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post mail...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
