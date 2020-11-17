import {ResourceWithoutId, Resource} from './resource.model';

export interface SousSectionStrategieFields {
    nom: string;
}

export interface ISousSectionStrategie extends SousSectionStrategieFields, ResourceWithoutId {}
export class SousSectionStrategie implements SousSectionStrategieFields, Resource {
    nom: string;
    id: number;
}

export enum EnumSousSectionStrategie {
    SS3 = 1,
    SS4 = 2,
}
