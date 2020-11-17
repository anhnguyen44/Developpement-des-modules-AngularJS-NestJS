import {ResourceWithoutId, Resource} from './resource.model';

export interface QualiteFields {
    nom: string;
    isInterne: boolean;
}

export interface IQualite extends QualiteFields, ResourceWithoutId {}
export class Qualite implements QualiteFields, Resource {
    nom: string;
    isInterne: boolean;
    id: number;
}
