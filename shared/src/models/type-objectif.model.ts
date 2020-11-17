import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { TypeProduit } from '../..';

export interface TypeObjectifFields {
    nom: string;
    code: string;
}

export interface ITypeObjectif extends TypeObjectifFields, ResourceWithoutId {}
export class TypeObjectif implements TypeObjectifFields, Resource {
    nom: string;
    code: string;
    id: number;
}

export enum EnumTypeObjectifs {
    FACULTATIF = 0,
    CT = 1,
    CSP = 2
}
