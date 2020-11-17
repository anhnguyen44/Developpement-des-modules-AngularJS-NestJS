import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { TypeProduit } from '../..';

export interface TypeGrilleFields {
    nom: string;
    refDefaut: string;
    categories: TypeProduit[];
}

export interface ITypeGrille extends TypeGrilleFields, ResourceWithoutId {}
export class TypeGrille implements TypeGrilleFields, Resource {
    nom: string;
    refDefaut: string;
    categories: TypeProduit[];
    id: number;
}

export enum TypeGrilles {
    LABO = 1,
    FORMATION = 2,
    CONSEIL = 3,
    BIM = 4,
    CONTROLES = 5,
}
