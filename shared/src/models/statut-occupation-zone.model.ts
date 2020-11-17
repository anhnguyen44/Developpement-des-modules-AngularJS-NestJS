import { ResourceWithoutId, Resource } from './resource.model';

export interface StatutOccupationZoneFields {
    nom: string;
}

export interface IStatutOccupationZone extends StatutOccupationZoneFields, ResourceWithoutId { }
export class StatutOccupationZone implements StatutOccupationZoneFields, Resource {
    nom: string;
    id: number;
}

export enum EnumStatutOccupationZone {
    LOCAL_DE_VIE_VIDE = 1,
    LOCAL_DE_VIE_OCCUPE = 2,
    LOCAL_OCCASIONNELLEMENT_VISITE_VIDE = 3,
    LOCAL_OCCASIONNELLEMENT_VISITE_OCCUPE = 4,
}
