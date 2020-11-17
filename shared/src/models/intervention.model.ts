import {IRendezVous} from './rendez-vous.model';
import {IPrelevement} from './prelevement.model';
import {IFichier} from './fichier.model';
import {ISitePrelevement} from './site-prelevement.model';
import {IBureau} from './bureau.model';
import {IFiltre} from './filtre.model';

export interface IIntervention {

    id: number,
    libelle: string,
    rang: number,

    commentaire: string,

    idFranchise: number,
    idChantier: number,
    idStrategie: number,

    nbPompeMeta: number,
    nbPompeEnvi: number,

    nbFiltreMeta: number,
    nbFiltreEnvi: number,

    idStatut: number,

    idOrdreIntervention: number,
    ordreIntervention: IFichier,

    idOrdreInterventionValide: number,
    ordreInterventionValide: IFichier,

    dateValidation: Date,
    idOrigineValidation: number,

    idFacture: number,

    idRendezVous: number,
    rendezVous: IRendezVous,

    prelevements: IPrelevement[],

    idDevisCommande: number,

    idSiteIntervention: number,
    siteIntervention: ISitePrelevement

    idBureau: number
    bureau: IBureau;

    idFiltreTemoinPI: number;
    filtreTemoinPI: IFiltre;

    idFiltreTemoinPPF: number;
    filtreTemoinPPF: IFiltre;
}


export enum EnumOrigineValidation {
    'SIGNATURE' = 1,
    'SIGNATURE_GLOBAL' = 2,
    'MAIL' = 3,
    'TELEPHONE' = 4
}

export enum EnumStatutIntervention {
    'SAISIE' = 1,
    'VALIDE' = 2,
    'DEPART_TERRAIN' = 3,
    'RETOUR_TERRAIN' = 4,
    'TERMINE' = 5
}

export enum EnumPosition {
    'DEBOUT' = 1,
    'ASSIS' = 2,
    'ALLONGE' = 3,
    'AUTRE' = 4
}

