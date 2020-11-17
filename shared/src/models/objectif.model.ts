import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { TypeObjectif } from './type-objectif.model';
import { MomentObjectif } from './moment-objectif.model';

export interface ObjectifFields {
    nom: string;
    code: string;
    description: string;
    lettre: string;
    type: TypeObjectif;
    idType: number;
    momentObjectif: MomentObjectif;
    idMomentObjectif: number;
    isMesureOperateur: boolean;
    isObligatoireCOFRAC: boolean;
    SAFibreParLitre: number;
    limiteSup: number;
    isPeriodique: boolean;
    conditionsApplication: string;

    duree: string;
    frequence: string;
    hasTempsCalcule: boolean;
    simulationObligatoire: EnumSimulationObligatoire;
}

export interface IObjectif extends ObjectifFields, ResourceWithoutId {}
export class Objectif implements ObjectifFields, Resource {
    conditionsApplication: string;
    isPeriodique: boolean;
    SAFibreParLitre: number;
    limiteSup: number;
    nom: string;
    code: string;
    description: string;
    lettre: string;
    type: TypeObjectif;
    idType: number;
    momentObjectif: MomentObjectif;
    idMomentObjectif: number;
    isMesureOperateur: boolean;
    isObligatoireCOFRAC: boolean;
    id: number;
    
    duree: string;
    frequence: string;
    hasTempsCalcule: boolean;
    simulationObligatoire: EnumSimulationObligatoire;
}

export enum EnumSimulationObligatoire {
    JAMAIS = 0,
    POSSIBLE = 1,
    TOUJOURS = 2,
}

export enum EnumObjectifs {
    A = 1,
    B,
    C,
    D,
    E,
    F,
    G,
    AnnexeB_F1_6Pt0,
    AnnexeB_F7Pt0,
    AnnexeB_F8Pt0,
    AnnexeB_F9Pt0,
    AnnexeB_F10Pt0,
    AnnexeB_F12Pt0,
    AnnexeB_F15Pt0,
    AnnexeB_F16Pt0,
    H,
    I,
    J,
    K,
    L,
    M,
    MExt,
    N,
    O,
    P,
    Q,
    R,
    S,
    ANNEXE_B_F1,
    ANNEXE_B_F2,
    ANNEXE_B_F3,
    ANNEXE_B_F4,
    ANNEXE_B_F5,
    ANNEXE_B_F6,
    ANNEXE_B_F7,
    ANNEXE_B_F8,
    ANNEXE_B_F9,
    ANNEXE_B_F10,
    ANNEXE_B_F12,
    ANNEXE_B_F14,
    ANNEXE_B_F15,
    ANNEXE_B_F16,
    ANNEXE_B_F17,
    Y,
    T,
    U,
    V,
    W,
    X,
}
