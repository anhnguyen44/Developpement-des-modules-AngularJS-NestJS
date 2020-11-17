import {IRessourceHumaine} from './ressource-humaine.model';
import {IPrelevement} from './prelevement.model';

export interface IFicheExposition {

    id: number,
    idRessourceHumaine: number,
    ressourceHumaine: IRessourceHumaine
    idPrelevement: number,
    prelevement: IPrelevement,
    date: Date,
    duree: number,
    idRisqueNuisance: number,
    autreRisqueNuisance: string,
    idEPI: number,
    autreEPI: string,
}

export enum EnumRisqueNuisance {
    'AUCUN' = 1,
    'RISQUE_BIOLOGIQUE' = 2,
    'RAYONNEMENT_IONISANT' = 3,
    'RISQUE_CHIMIQUE' = 4,
    'AUTRE' = 5
}

export enum EnumEPI {
    'AUCUN' = 1,
    'VA' = 2,
    'AA' = 3,
    'DEMI_VA' = 4,
    'AUTRE' = 5
}
