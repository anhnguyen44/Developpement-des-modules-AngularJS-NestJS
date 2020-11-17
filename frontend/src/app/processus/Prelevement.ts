import { GES, IPrelevement, ProcessusZone, SitePrelevement, ZoneIntervention } from '@aleaac/shared';
import { Chantier } from '../chantier/Chantier';
import { AffectationPrelevement } from '../prelevement/AffectationPrelevement';
import { Intervention } from '../intervention/Intervention';
import { Objectif } from '../resource/objectif/Objectif';
import { Processus } from './Processus';
import { Echantillonnage } from '@aleaac/shared';
import {CmdAnalyse} from '../prelevement/CmdAnalyse';
import {FicheExposition} from '../prelevement/FicheExposition';

export class Prelevement implements IPrelevement {

    checked: boolean;
    affectationsPrelevement: AffectationPrelevement[];
    chantier: Chantier;
    conditions: string;

    ges: GES;
    idGes: number;
    id: number;
    idChantier: number;
    idEchantillonnage: number;
    echantillonnage: Echantillonnage;
    idFractionAnalyse: number;
    idFractionStrategie: number;
    idFranchise: number;
    idIntervention: number;
    idObjectif: number;
    idProcessus: number;
    idSitePrelevement: number;
    idStrategie: number;
    idTypeEcartSaVisee: number;
    idTypePrelevement: number;
    idZIPrel: number;
    interventions: Intervention[];
    isCofrac: boolean;
    isDelaiExpress: boolean;
    nbOuverturesGrilleAnalyse: number;
    nbOuverturesGrilleStrategie: number;
    objectif: Objectif;
    processus: Processus;
    reference: string;
    saViseeAnalyse: number;
    saViseeStrategie: number;
    sitePrelevement: SitePrelevement;
    surfaceFiltration: number;
    surfaceMoyenneOuvertures: number;
    tempsExposition: number;
    idProcessusZone: number;
    processusZone: ProcessusZone;
    isCreeApresStrategie: boolean;
    idStatutPrelevement: number;
    zoneIntervention: ZoneIntervention;
    countInter: number;
    cmdAnalyse: CmdAnalyse;
    idCmdAnalyse: number;
    isSaisie: boolean;

    directionVentApres: string;
    directionVentAvant: string;
    directionVentPendant: string;
    humiditeApres: number;
    humiditeAvant: number;
    humiditePendant: number;
    pluieApres: number;
    pluieAvant: number;
    pluiePendant: number;
    pressionApres: number;
    pressionAvant: number;
    pressionPendant: number;
    temperatureApres: number;
    temperatureAvant: number;
    temperaturePendant: number;
    vistesseVentApres: number;
    vistesseVentAvant: number;
    vistesseVentPendant: number;

    isFicheExposition: boolean;

    isPrelevementMateriaux: boolean;
    idPrelevementMateriaux: number | null;
    // prelevementMateriaux: Prelevement | null;

    localisation: string;

    conditionHumiditeApres: number;
    conditionHumiditeAvant: number;
    conditionHumiditePendant: number;
    conditionPressionApres: number;
    conditionPressionAvant: number;
    conditionPressionPendant: number;
    conditionTemperatureApres: number;
    conditionTemperatureAvant: number;
    conditionTemperaturePendant: number;

    idPointPrelevementMEST: number;
    referenceFlaconMEST: string;

    fichesExposition: FicheExposition[];
}
