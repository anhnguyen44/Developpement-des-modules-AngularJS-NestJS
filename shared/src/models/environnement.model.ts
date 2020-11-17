import {ResourceWithoutId, Resource} from './resource.model';

export interface EnvironnementFields {
    nom: string;
}

export interface IEnvironnement extends EnvironnementFields, ResourceWithoutId {}
export class Environnement implements EnvironnementFields, Resource {
    nom: string;
    id: number;
}

export enum EnumEnvironnement {
    AIR_URBAIN = 1,
    AIR_CAMPAGNE = 2,
    MILIEU_INTERIEUR = 3
}
