import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { TypeProduit } from '../..';

export interface TypeFacturationFields {
    nom: string;
}

export interface ITypeFacturation extends TypeFacturationFields, ResourceWithoutId {}
export class TypeFacturation implements TypeFacturationFields, Resource {
    nom: string;
    id: number;
}

export enum TypeFacturations {
    DATE_REALISATION = 1,
    FIN_MOIS = 2,
    FIN_MOIS_SUIVANT = 3,
    NB_JOURS = 4,
}
