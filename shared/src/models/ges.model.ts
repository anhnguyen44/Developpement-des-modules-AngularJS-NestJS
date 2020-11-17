import {ResourceWithoutId, Resource} from './resource.model';
import { ZoneIntervention } from './zone-intervention.model';
import { ITacheProcessus } from './tache-processus.model';

export interface GESFields {
    nom: string;
    description: string;

    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;

    nbPompes: number;
    nbFiltres: number;
    nbOperateursTerrain: number;
    taches: ITacheProcessus[];
    phaseOperationnelle: EnumPhaseOperationnelle;
}

export interface IGES extends GESFields, ResourceWithoutId {}
export class GES implements GESFields, Resource {
    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;
    description: string;
    nom: string;
    id: number;

    nbPompes: number;
    nbFiltres: number;
    nbOperateursTerrain: number;
    taches: ITacheProcessus[];
    phaseOperationnelle: EnumPhaseOperationnelle;

}

export enum EnumPhaseOperationnelle {
    Installation = 1,
    Retrait = 2,
    Repli = 3,
}