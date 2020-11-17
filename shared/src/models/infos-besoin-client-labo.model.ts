import {ResourceWithoutId, Resource} from './resource.model';
import { BesoinClientLabo } from './besoin-client-labo.model';

export interface InfosBesoinClientLaboFields {
    libelle: string;
    contenu: string;
    informateur: string;
    besoinClientLabo: BesoinClientLabo;
    idBesoinClientLabo: number;
}

export interface IInfosBesoinClientLabo extends InfosBesoinClientLaboFields, ResourceWithoutId {}
export class InfosBesoinClientLabo implements InfosBesoinClientLaboFields, Resource {
    libelle: string;
    contenu: string;
    informateur: string;
    besoinClientLabo: BesoinClientLabo;
    idBesoinClientLabo: number;
    id: number;
}
