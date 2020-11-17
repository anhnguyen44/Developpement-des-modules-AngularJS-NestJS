import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { ITemplateVersion, TemplateVersion } from '@aleaac/shared';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class TemplateVersionService {
  apiUrl = environment.api;
  constructor(
    // @Inject(ApiUrl) private apiUrl: string,
    private http: HttpClient,
    private resourceService: ResourceService,
    private notificationService: NotificationService
  ) { }

  createTemplateVersion(templateVersion: ITemplateVersion): Observable<TemplateVersion> {
    const $data = this.http
      .post(this.templateVersionApi, templateVersion).pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getAllTemplateVersion(): Observable<TemplateVersion[]> {
    const $data = this.http
      .get(this.templateVersionApi + '/getAll/').pipe(
        map((resp: any) => resp.data),
        share(), take(1)
      );
    return $data.pipe(catchError(this.handleError));
  }

  getTemplateVersionById(id: number): Observable<TemplateVersion> {
    return <Observable<TemplateVersion>>this.resourceService.getResource(id, 'template-version');
  }

  removeTemplateVersion(id: number): Observable<void> {
    return this.resourceService.deleteResource(id, 'template-version');
  }

  updateTemplateVersion(templateVersion: TemplateVersion): Observable<TemplateVersion> {
    return <Observable<TemplateVersion>>this.resourceService.updateResource(templateVersion, 'template-version');
  }

  private get templateVersionApi(): string {
    return this.apiUrl + '/template-version';
  }

  private handleError = (errorResp: any): Promise<any> => {
    // TODO: don't propagete errors, e.g. post templateVersion...
    const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
    this.notificationService.setNotification('danger', [error]);
    return Promise.reject(error);
  }
}
