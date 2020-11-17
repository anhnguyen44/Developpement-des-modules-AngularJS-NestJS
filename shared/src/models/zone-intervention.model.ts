import { ResourceWithoutId, Resource } from './resource.model';
import { EnumTypeZoneIntervention } from './type-zone-intervention.model';
import { EnumStatutOccupationZone, Batiment, Environnement, IFichier } from '../..';
import { MateriauZone, EnumMilieu, EnumDensiteOccupationTheorique, EnumTypeActivite, EnumExpositionAir, EnumExpositionChocs } from './materiau-zone.model';
import { LocalUnitaire } from './local-unitaire.model';
import { ProcessusZone } from './processus-zone.model';
import { GES } from './ges.model';
import { HorairesOccupationLocaux } from './horairesOccupationLocaux.model';
import { Echantillonnage } from './echantillonnage.model';
import { Strategie } from './strategie.model';

export interface ZoneInterventionFields {
    reference: string;
    type: EnumTypeZoneIntervention
    libelle: string;
    descriptif: string; // text depuis liste
    statut: EnumStatutOccupationZone;
    batiment: Batiment | null;
    idBatiment: number | null;
    horaires: HorairesOccupationLocaux[];
    isZoneDefinieAlea: boolean;
    isSousAccreditation: boolean;
    commentaire: string; // text
    materiauxZone: MateriauZone[];
    locaux: LocalUnitaire[];
    nbPiecesUnitaires: number; // Non modifiable
    nbPrelevementsCalcul: number; // Non modifiable
    nbPrelevementsARealiser: number;
    commentaireDifferenceNbPrelevements: string;
    dureeMinPrelevement: number;  // Modifiable mais si != 4h/24h en fct° du prlvmt, alerte car perte COFRAC
    sequencage: EnumSequencage; // Non modifiable
    repartition: string; // Liste enrichissable à initialiser
    precisionsRepartition: string; // text, liste enrichissable
    processusZone: ProcessusZone[];
    stationMeteo: string; // TODO : on en fait quoi ?
    dureeTraitementEnSemaines: number;
    environnements: Environnement[];
    confinement: EnumConfinement;
    listeGES: GES[];
    echantillonnages: Echantillonnage[];
    isExterieur: boolean;

    strategie: Strategie;
    idStrategie: number;

    PIC: IFichier | null;
    idPIC: number | null;
    isZoneInf10: boolean;
    nbGrpExtracteurs: number | null;
    milieu: number;

    conditions: string; // Circulation Air suffisante/Insuffisante

    // Infos supplémentaires : moved from MateriauZone
    densiteOccupationTheorique: EnumDensiteOccupationTheorique | null;
    typeActivite: EnumTypeActivite | null;
    commentaireOccupation: string; // text, liste enrichissable
    expositionAir: EnumExpositionAir | null;
    expositionChocs: EnumExpositionChocs | null;
    commentaireExpositionAirChocs: string; // text, liste enrichissable

    repartitionPrelevements: string;
    autreActivite: string;  // si typeActivite == Autre, on remplit ça
}

export interface IZoneIntervention extends ZoneInterventionFields, ResourceWithoutId { }
export class ZoneIntervention implements ZoneInterventionFields, Resource {
    conditions: string; // Circulation Air suffisante/Insuffisante
    
    echantillonnages: Echantillonnage[];
    reference: string;
    type: EnumTypeZoneIntervention;
    libelle: string;
    descriptif: string;
    statut: EnumStatutOccupationZone;
    batiment: Batiment | null;
    idBatiment: number | null;
    horaires: HorairesOccupationLocaux[];
    isZoneDefinieAlea: boolean;
    isSousAccreditation: boolean;
    commentaire: string;
    materiauxZone: MateriauZone[];
    locaux: LocalUnitaire[];
    nbPiecesUnitaires: number;
    nbPrelevementsCalcul: number;
    nbPrelevementsARealiser: number;
    commentaireDifferenceNbPrelevements: string;
    dureeMinPrelevement: number;
    sequencage: EnumSequencage;
    repartition: string;
    precisionsRepartition: string;
    processusZone: ProcessusZone[];
    stationMeteo: string;
    dureeTraitementEnSemaines: number;
    environnements: Environnement[];
    confinement: EnumConfinement;
    listeGES: GES[];
    id: number;
    isExterieur: boolean;

    strategie: Strategie;
    idStrategie: number;

    PIC: IFichier | null;
    idPIC: number | null;
    isZoneInf10: boolean;
    nbGrpExtracteurs: number | null;
    milieu: number;

    // Infos supplémentaires : moved from MateriauZone
    densiteOccupationTheorique: EnumDensiteOccupationTheorique | null;
    typeActivite: EnumTypeActivite | null;
    commentaireOccupation: string; // text, liste enrichissable
    expositionAir: EnumExpositionAir | null;
    expositionChocs: EnumExpositionChocs | null;
    commentaireExpositionAirChocs: string; // text, liste enrichissable

    repartitionPrelevements: string; // text
    autreActivite: string;  // si typeActivite == Autre, on remplit ça

    selected?: boolean;
}

export enum EnumSequencage {
    CONTINU,
    NON_CONTINU
}

export enum EnumConfinement {
    ABSENCE,
    STATIQUE,
    DYNAMIQUE
}
