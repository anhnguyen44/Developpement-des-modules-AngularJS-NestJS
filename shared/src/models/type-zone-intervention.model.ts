import { ResourceWithoutId, Resource } from './resource.model';

export interface TypeZoneInterventionFields {
    nom: string;
}

export interface ITypeZoneIntervention extends TypeZoneInterventionFields, ResourceWithoutId { }
export class TypeZoneIntervention implements TypeZoneInterventionFields, Resource {
    nom: string;
    id: number;
}

export enum EnumTypeZoneIntervention {
    ZH = 1,
    ZT = 2,
}
