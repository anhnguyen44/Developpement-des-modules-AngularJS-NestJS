import { ResourceWithoutId, Resource } from './resource.model';
import { Utilisateur } from '../..';
import { NotificationVuPar } from './notification-vu-par.model';

export interface NotificationFields {
    destinataires: Utilisateur[];
    demandeur: Utilisateur | null;
    idDemandeur: number | null;
    valideur: Utilisateur | null;
    idValideur: number | null;
    contenu: string; // text
    importance: number; // Faire une enum ?
    dateEnvoi: Date;

    vuePar: NotificationVuPar[];
    lien: string | null;
    vu: boolean; // Pour le front
}

export interface INotification extends NotificationFields, ResourceWithoutId { }
export class Notification implements NotificationFields, Resource {
    destinataires: Utilisateur[];
    demandeur: Utilisateur | null;
    idDemandeur: number | null;
    valideur: Utilisateur | null;
    idValideur: number | null;
    contenu: string;
    importance: number;
    dateEnvoi: Date;
    vuePar: NotificationVuPar[];
    id: number;
    lien: string | null;

    vu: boolean; // Pour le front
}

export enum EnumImportanceNotification {
    MIN = 0,
    FAIBLE = 1,
    NORMAL = 2,
    FORT = 3,
    MAX = 4,
}