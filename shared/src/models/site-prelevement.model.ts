import {ResourceWithoutId, Resource} from './resource.model';
import { Adresse } from './adresse.model';
import { Batiment } from './batiment.model';
import { IFichier } from './fichier.model';

export interface SitePrelevementFields {
    nom: string;
    adresse: Adresse;
    idAdresse: number;
    batiments: Batiment[];
    latitude: number; // DECIMAL (10,8)
    longitude: number; // DECIMAL (11,8)
    accesHauteurNecessaire: boolean;
    electriciteSurPlace: boolean;
    combles: boolean;
    digicode: string;
    commentaire: string;
    photos: IFichier[];
    selected?: boolean;
    idChantier: number;
}

export interface ISitePrelevement extends SitePrelevementFields, ResourceWithoutId {}
export class SitePrelevement implements SitePrelevementFields, Resource {
    idChantier: number;
    nom: string;    adresse: Adresse;
    idAdresse: number;
    batiments: Batiment[];
    latitude: number;
    longitude: number;
    accesHauteurNecessaire: boolean;
    electriciteSurPlace: boolean;
    combles: boolean;
    digicode: string;
    commentaire: string;
    photos: IFichier[];
    id: number;
    selected?: boolean;
}
