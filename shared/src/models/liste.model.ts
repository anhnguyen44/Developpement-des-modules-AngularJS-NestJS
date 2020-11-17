import { ResourceWithoutId, Resource } from './resource.model';
import { Franchise } from './franchise.model';

export interface ListeFields {
    typePartage: EnumTypePartageListe;
    nomListe: string;
    resume: string;
    valeur: string; // text
    ordre: number;
    isLivreParDefaut: boolean;
    sousListe: string | null;
    franchise: Franchise | null;
    idFranchise: number | null;
}

export interface IListe extends ListeFields, ResourceWithoutId { }
export class Liste implements ListeFields, Resource {
    typePartage: EnumTypePartageListe;
    nomListe: string;
    resume: string;
    valeur: string;
    ordre: number;
    isLivreParDefaut: boolean;
    sousListe: string | null;
    id: number;

    franchise: Franchise | null;
    idFranchise: number | null;
}

export enum EnumTypePartageListe {
    Aucun,
    Franchise,
    Reseau
}
