import { IProcessus } from './processus.model';
import { IIntervention } from './intervention.model';
import { IChantier } from './chantier.model';
import { IGES } from './ges.model';
import { IAffectationPrelevement } from './affectationPrelevement.model';
import { IObjectif } from './objectif.model';
import { ISitePrelevement } from './site-prelevement.model';
import { IEchantillonnage, Echantillonnage } from './echantillonnage.model';
import { IProcessusZone } from './processus-zone.model';
import { IZoneIntervention } from './zone-intervention.model';
import {ICmdAnalyse} from './cmd-analyse.model';
import {IFicheExposition} from './fiche-exposition.model';


export interface IPrelevement {
    id: number,
    idFranchise: number,
    interventions: IIntervention[];
    idChantier: number;
    chantier: IChantier;
    idTypePrelevement: number;
    reference: string,

    idProcessus: number,
    processus: IProcessus,

    idProcessusZone: number,
    processusZone: IProcessusZone,

    ges: IGES,
    idGes: number,

    affectationsPrelevement: IAffectationPrelevement[];

    idStrategie: number,

    idZIPrel: number,
    zoneIntervention: IZoneIntervention,

    idEchantillonnage: number,
    echantillonnage: Echantillonnage,

    idObjectif: number,
    objectif: IObjectif,

    idSitePrelevement: number,
    sitePrelevement: ISitePrelevement,

    conditions: string,
    isDelaiExpress: boolean,

    idFractionStrategie: number,
    idFractionAnalyse: number,
    saViseeStrategie: number,
    saViseeAnalyse: number,
    idTypeEcartSaVisee: number,
    nbOuverturesGrilleStrategie: number,
    nbOuverturesGrilleAnalyse: number,
    surfaceFiltration: number,
    surfaceMoyenneOuvertures: number,

    isCofrac: boolean,

    isCreeApresStrategie: boolean,
    idStatutPrelevement: number,

    idCmdAnalyse: number,
    cmdAnalyse: ICmdAnalyse

    // METEO
    pluieAvant: number;
    vistesseVentAvant: number;
    directionVentAvant: string;
    temperatureAvant: number;
    humiditeAvant: number;
    pressionAvant: number;

    pluiePendant: number;
    vistesseVentPendant: number;
    directionVentPendant: string;
    temperaturePendant: number;
    humiditePendant: number;
    pressionPendant: number;

    pluieApres: number;
    vistesseVentApres: number;
    directionVentApres: string;
    temperatureApres: number;
    humiditeApres: number;
    pressionApres: number;

    // CONDITION
    conditionTemperatureAvant: number;
    conditionPressionAvant: number;
    conditionHumiditeAvant: number;
    conditionTemperaturePendant: number;
    conditionPressionPendant: number;
    conditionHumiditePendant: number;
    conditionTemperatureApres: number;
    conditionPressionApres: number;
    conditionHumiditeApres: number;

    isPrelevementMateriaux: boolean;
    isFicheExposition: boolean;

    idPrelevementMateriaux: number | null;
    // prelevementMateriaux: IPrelevement | null;

    localisation: string;

    idPointPrelevementMEST: number;
    referenceFlaconMEST: string;

    fichesExposition: IFicheExposition[];

}

export enum EnumFractionFiltre {
    '1/8' = 1,
    '1/4' = 2,
    '1/2' = 3,
    '3/4' = 4
}

export enum EnumTypePrelevement {
    'ENVIRONNEMENTAL' = 1,
    'METAOP' = 2,
    'MEST' = 3,
    'MATERIAUX' = 4
}

export enum EnumStatutPrelevement {
    'EN_ATTENTE' = 1,
    'PLANIFIE' = 2,
    'ABANDONNE' = 3,
    'POSE' = 4,
    'PRELEVE' = 5,
    'NON_EFFECTUE' = 6,
    'ATTENTE_ENVOI_ANALYSE' = 7,
    'ANALYSE_ENVOYEE' = 8,
    'RETOUR_ANALYSE' = 9,
    'PV_ENVOYE' = 10
}

export enum EnumTypeEcartSaVisee {
    'COURTE_DUREE' = 1,
    'FORT_EMPOUSSIEREMENT' = 2
}

export enum EnumPointPrelevement {
    'REJET_SAS_DOUCHE_PERSONNEL' = 1,
    'REJET_SAS8DOUCHE_MATERIEL_OU_DECHET'
}

export enum EnumPluie {
    'AUCUNE' = 1,
    'FAIBLE' = 2,
    'MOYENNE' = 3,
    'FORTE' = 4
}
