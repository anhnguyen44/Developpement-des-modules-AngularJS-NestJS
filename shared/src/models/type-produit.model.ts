import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';

export interface TypeProduitFields {
    nom: string;
    rang: number;
}

export interface ITypeProduit extends TypeProduitFields, ResourceWithoutId {}
export class TypeProduit implements TypeProduitFields, Resource {
    nom: string;
    id: number;
    rang: number;
}

export enum TypeProduits {
    LABO = 1,
    FORMATION = 2,
    BIM = 3,
    VE = 4,
    DIVERS = 5,
    AUTRES_PRLVTS = 6,
    PERSO = 7,
    DEPLACEMENT = 8
}
