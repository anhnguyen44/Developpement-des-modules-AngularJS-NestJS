import { ResourceWithoutId, Resource } from './resource.model';

export interface TypeLocalFields {
    nom: string;
}

export interface ITypeLocal extends TypeLocalFields, ResourceWithoutId { }
export class TypeLocal implements TypeLocalFields, Resource {
    nom: string;
    id: number;
}

export enum EnumTypeLocal {
    S_INF_10M2 = 1,
    S_INF_EGAL_100M2_L_INF_EGAL_15M = 2,
    S_INF_EGAL_100M2_L_SUP_15M = 3,
    S_SUP_100M2 = 4,
    GROUPEMENT = 5,
    CAGE_ESCALIER = 6
}
