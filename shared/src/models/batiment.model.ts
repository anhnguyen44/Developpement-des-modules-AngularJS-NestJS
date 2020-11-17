import {ResourceWithoutId, Resource} from './resource.model';
import { IFichier } from './fichier.model';
import { TypeBatiment } from './type-batiment.model';
import { SitePrelevement } from './site-prelevement.model';

export interface BatimentFields {
    nom: string;
    description: string;
    plans: IFichier[];
    typeBatiment: TypeBatiment
    sitePrelevement: SitePrelevement;
    idSitePrelevement: number;
}

export interface IBatiment extends BatimentFields, ResourceWithoutId {}
export class Batiment implements BatimentFields, Resource {
    sitePrelevement: SitePrelevement;
    idSitePrelevement: number;
    typeBatiment: TypeBatiment;
    nom: string;
    description: string;
    plans: IFichier[];
    id: number;
}
