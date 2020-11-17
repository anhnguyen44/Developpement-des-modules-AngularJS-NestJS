import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiUrl } from '../api-url';
import { ResourceService } from '../resource.service';
import { map, catchError, share, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { INotification, Notification } from '@aleaac/shared';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class NotificationUserService {
    apiUrl = environment.api;
    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private resourceService: ResourceService,
        private notificationService: NotificationService
    ) { }

    createNotification(notification: INotification): Observable<Notification> {
        const $data = this.http
            .post(this.notificationApi, notification).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getAllNotification(idUser: number): Observable<Notification[]> {
        const $data = this.http
            .get(this.notificationApi + '/getAll/' + idUser).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    countUnread(idUser: number): Observable<number> {
        const $data = this.http
            .get(this.notificationApi + '/countUnread/' + idUser).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getNotificationById(id: number): Observable<Notification> {
        return <Observable<Notification>>this.resourceService.getResource(id, 'notification');
    }

    removeNotification(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'notification');
    }

    updateNotification(notification: Notification): Observable<Notification> {
        return <Observable<Notification>>this.resourceService.updateResource(notification, 'notification');
    }

    private get notificationApi(): string {
        return this.apiUrl + '/notification';
    }

    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post notification...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }
}
