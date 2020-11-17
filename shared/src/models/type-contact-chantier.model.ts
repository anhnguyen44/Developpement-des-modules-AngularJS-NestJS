import { ResourceWithoutId, Resource } from './resource.model';

export interface TypeContactChantierFields {
    nom: string;
    code: string;
}

export interface ITypeContactChantier extends TypeContactChantierFields, ResourceWithoutId { }
export class TypeContactChantier implements TypeContactChantierFields, Resource {
    nom: string;
    code: string;
    id: number;
}

export enum EnumTypeContactChantiers {
    RAPPORT_A_REMETTRE_A = 1,
    DONNEUR_ORDRE = 2,
    INTERLOC_CHANTIER = 3,
    MAITRE_OUVRAGE = 4
}
