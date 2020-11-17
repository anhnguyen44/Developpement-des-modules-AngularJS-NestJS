import { ResourceWithoutId, Resource } from './resource.model';
import { MateriauConstructionAmiante } from './materiau-construction.model';
import { ZoneIntervention } from './zone-intervention.model';

export interface MateriauZoneFields {
    /* LIAISON */
    materiau: MateriauConstructionAmiante | null;
    idMateriau: number | null;
    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;
    materiauAutre: string | null;

    /* INFOS COMPLEMENTAIRES */
    etatDegradation: EnumEtatDegradation | null;
    etendueDegradation: EnumEtendueDegradation | null;
    commentaireDegradation: string; // text, liste enrichissable
    moyenProtection: EnumProtection | null;
    etancheiteProtection: EnumEtancheite | null;
    commentaireProtection: string; // text, liste enrichissable
    resultatConnu: EnumResultatExamenAmiante | null;

    isInfosNC: boolean;
}

export interface IMateriauZone extends MateriauZoneFields, ResourceWithoutId { }
export class MateriauZone implements MateriauZoneFields, Resource {
    materiau: MateriauConstructionAmiante | null;
    idMateriau: number | null;
    zoneIntervention: ZoneIntervention;
    idZoneIntervention: number;

    materiauAutre: string | null;

    etatDegradation: EnumEtatDegradation | null;
    etendueDegradation: EnumEtendueDegradation | null;
    commentaireDegradation: string;
    
    moyenProtection: EnumProtection | null;
    etancheiteProtection: EnumEtancheite | null;
    commentaireProtection: string;
    resultatConnu: EnumResultatExamenAmiante | null;
    id: number;

    selected?: boolean;

    isInfosNC: boolean;
}

export enum EnumDensiteOccupationTheorique {
    Faible,
    Forte,
    NC,
}

export enum EnumTypeActivite {
    Habitation,
    Enseignement,
    Bureaux,
    Commerce,
    NC,
    Industriel,
    Soins,
    Loisirs,
    Autre,
} // Dans un ordre bizarre, mais ça permet de conserver les données déjà saisies avant la modification

export enum EnumExpositionAir {
    Faible,
    Forte,
    NC,
}

export enum EnumExpositionChocs {
    Faible,
    Forte,
    NC,
}

export enum EnumEtatDegradation {
    NON_DEGRADE,
    DEGRADE,
    NC,
}

export enum EnumEtendueDegradation {
    Ponctuelle,
    Generalisee,
    NC,
}

export enum EnumProtection {
    Aucune,
    Encoffrement,
    Impregnation,
    NC,
}

export enum EnumEtancheite {
    NON_APPLICABLE,
    Bonne,
    Degradee,
    NC,
}

export enum EnumResultatExamenAmiante {
    SCORE_1, // Liste A
    SCORE_2, // Liste A
    SCORE_3, // Liste A
    AC1, // Liste B
    AC2, // Liste B
    EP // Liste B
}

export enum EnumMilieu {
    Interieur,
    Exterieur,
    LES_DEUX,
}
