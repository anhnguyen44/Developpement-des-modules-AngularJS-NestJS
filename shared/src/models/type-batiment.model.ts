import {ResourceWithoutId, Resource} from './resource.model';

export interface TypeBatimentFields {
    nom: string;
}

export interface ITypeBatiment extends TypeBatimentFields, ResourceWithoutId {}
export class TypeBatiment implements TypeBatimentFields, Resource {
    nom: string;
    id: number;
}

export enum EnumTypeBatiments {
    TRANCHEE = 1,
    ENVELOPPE_BATIMENT = 2,
    ROUTE = 3,
    INTERIEUR_BATIMENT = 4,
    TRAIN = 5,
    AERONEF = 6,
    NAVIRE = 7
}

export enum EnumTypeBatimentsForWord {
    "Tranchée" = 1,
    "Enveloppe de bâtiment" = 2,
    "Route" = 3,
    "Intérieur de bâtiment" = 4,
    "Train" = 5,
    "Aéronef" = 6,
    "Navire" = 7
}