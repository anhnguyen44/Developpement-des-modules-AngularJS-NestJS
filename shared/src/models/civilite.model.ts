import {ResourceWithoutId, Resource} from './resource.model';

export interface CiviliteFields {
    nom: string;
    abbrev: string;
}

export interface ICivilite extends CiviliteFields, ResourceWithoutId {}
export class Civilite implements CiviliteFields, Resource {
    abbrev: string;
    nom: string;
    id: number;
}
