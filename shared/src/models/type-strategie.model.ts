import {ResourceWithoutId, Resource} from './resource.model';

export interface TypeStrategieFields {
    nom: string;
}

export interface ITypeStrategie extends TypeStrategieFields, ResourceWithoutId {}
export class TypeStrategie implements TypeStrategieFields, Resource {
    nom: string;
    id: number;
}

export enum EnumTypeStrategie {
    SPATIALE = 1,
    SUIVI = 2,
    AUTRE = 3
}
