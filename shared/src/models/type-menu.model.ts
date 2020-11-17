import {ResourceWithoutId,Resource} from './resource.model';

export interface TypeMenuFields {
    nom: string
}

export interface ITypeMenu extends TypeMenuFields, ResourceWithoutId{}
export class TypeMenu implements TypeMenuFields, Resource{
    id: number;
    nom: string;
}

export enum TypeMenus {
    VIDE = 0,
    ALEAAC = 1
}
