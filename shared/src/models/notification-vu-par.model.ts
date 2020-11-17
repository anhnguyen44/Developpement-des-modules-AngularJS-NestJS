import { ResourceWithoutId, Resource } from './resource.model';
import { Utilisateur } from '../..';
import { Notification } from '../..';

export interface NotificationVuParFields {
    notification: Notification;
    idNotification: number;
    utilisateur: Utilisateur;
    idUtilisateur: number;

    date: Date;
}

export interface INotificationVuPar extends NotificationVuParFields, ResourceWithoutId { }
export class NotificationVuPar implements NotificationVuParFields, Resource {
    notification: Notification;
    idNotification: number;
    utilisateur: Utilisateur;
    idUtilisateur: number;
    date: Date;
    id: number;
}
