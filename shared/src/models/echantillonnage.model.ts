import {ResourceWithoutId, Resource} from './resource.model';
import { Objectif, IPrelevement, ZoneIntervention } from '../..';
import { ProcessusZone } from './processus-zone.model';

export interface EchantillonnageFields {
    typeMesure: EnumTypeMesure;
    code: string; // Généré
    objectif: Objectif;
    idObjectif: number;
    frequenceParSemaine: number;
    nbMesures: number; // Non modifiable
    nbMesuresARealiser: number;
    commentaireDifferenceMesure: string;
    localisation: string | null; // Si mesure environnementale
    duree: number | null; // En heures non modifiable
    dureeARealiser: number | null; // En heures
    commentaireDifferenceDuree: string;
    prelevements: IPrelevement[]; // Voir avec YMO, sinon intégrer les données nécessaires du §2.9.2 de la spec
    isRealise: boolean;
    commentaireNonRealise: string; // Liste enrichissable par tout le réseau

    zoneIntervention: ZoneIntervention;
    idZIEch: number;

    processusZone: ProcessusZone | null;
    idProcessusZone: number | null;
}

export interface IEchantillonnage extends EchantillonnageFields, ResourceWithoutId {}
export class Echantillonnage implements EchantillonnageFields, Resource {
    processusZone: ProcessusZone | null;
    idProcessusZone: number | null;
    zoneIntervention: ZoneIntervention;
    idZIEch: number;
    typeMesure: EnumTypeMesure;
    code: string;
    objectif: Objectif;
    idObjectif: number;
    frequenceParSemaine: number;
    nbMesures: number;
    nbMesuresARealiser: number;
    commentaireDifferenceMesure: string;
    localisation: string | null;
    duree: number | null;
    dureeARealiser: number | null;
    commentaireDifferenceDuree: string;
    prelevements: IPrelevement[];
    isRealise: boolean;
    commentaireNonRealise: string;
    id: number;
}

export enum EnumTypeMesure {
    ENVIRONNEMENTALE,
    SUR_OPERATEUR
}
