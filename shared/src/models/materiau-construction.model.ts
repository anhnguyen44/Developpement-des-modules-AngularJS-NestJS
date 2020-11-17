import { ResourceWithoutId, Resource } from './resource.model';

export interface MateriauConstructionAmianteFields {
    liste: EnumListeMateriauxAmiante;
    partieStructure: string;
    composantConstruction: string;
    partieComposant: string;
}

export interface IMateriauConstructionAmiante extends MateriauConstructionAmianteFields, ResourceWithoutId { }
export class MateriauConstructionAmiante implements MateriauConstructionAmianteFields, Resource {
    liste: EnumListeMateriauxAmiante;
    partieStructure: string;
    composantConstruction: string;
    partieComposant: string;
    id: number;
}

export enum EnumListeMateriauxAmiante {
    A = 1,
    B = 2,
    C = 3,
    Autre = 4
}
