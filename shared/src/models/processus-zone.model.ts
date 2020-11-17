import { ResourceWithoutId, Resource } from './resource.model';
import { MateriauConstructionAmiante } from './materiau-construction.model';
import { ZoneIntervention } from './zone-intervention.model';
import { Processus } from './processus.model';
import { GES, IGES } from './ges.model';


export interface ProcessusZoneFields {
    /* LIAISON */
    processus: Processus;
    idProcessus: number;
    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;

    /* INFOS COMPLEMENTAIRES */
    typeChantier: EnumTypeDeChantier | null;

    nombreVacationsJour: number; // Ca devient le nomvbre de *séquences*
    idEmpoussierementGeneralAttendu: number; // moved from processus
    idAppareilsProtectionRespiratoire: number; // moved from processus
    nombreOperateurs: number, // moved from processus

    tsatP: number;
    tr: number;

    listeGES: IGES[]; // maintenant on n'en a plus qu'une

    nombreJours: number;
    dureeSequence: number;
    
    typeAnalyse: number;
}

export interface IProcessusZone extends ProcessusZoneFields, ResourceWithoutId { }
export class ProcessusZone implements ProcessusZoneFields, Resource {
    nombreVacationsJour: number; // Ca devient le nomvbre de *séquences*
    idEmpoussierementGeneralAttendu: number;
    idAppareilsProtectionRespiratoire: number;
    nombreOperateurs: number;
    processus: Processus;
    idProcessus: number;
    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;
    typeChantier: EnumTypeDeChantier | null; // Null si ZH
    id: number;

    selected?: boolean;
    listeGES: GES[]; // maintenant on n'en a plus qu'une

    tsatP: number;
    tr: number;

    nombreJours: number;
    dureeSequence: number;

    typeAnalyse: number;
}

export enum EnumTypeDeChantier {
    TEST,
    VALIDATION,
    SURVEILLANCE
}

export enum EnumTypeAnalysePrelevement {
    CONJOINT = 1,
    SOUS_GROUPE = 2,
    SEPARE = 3 
}
