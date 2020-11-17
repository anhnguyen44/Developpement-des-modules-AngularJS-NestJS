import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';

export interface ProfilFields {
    nom: string;
    droits?: IDroit[];
    isVisibleFranchise: boolean;
    isInterne: boolean;
}

export interface IProfil extends ProfilFields, ResourceWithoutId {}
export class Profil implements ProfilFields, Resource {
    isVisibleFranchise: boolean;
    nom: string;
    droits?: IDroit[];
    id: number;
    isInterne: boolean;
}

export enum profils {
    PARTAGE = 0,
    SUPER_ADMIN = 1,
    ADMIN = 2,
    FRANCHISE = 3,
    TECHNICIEN = 4,
    PROFESSIONNEL = 5,
    DEV = 6,
    ANIMATEUR_QUALITE = 7,
    RESPO_LABO = 8,
    RESPO_TECHNIQUE = 9,
    RESPO_PROD = 10,
    TECHNICO_COMMERCIAL = 11,
    ASSIST_ADMIN = 12,
    ADMIN_CONTENU = 15,
}