import {IIntervention, ISitePrelevement} from '@aleaac/shared';
import {RendezVous} from '../logistique/RendezVous';
import {Prelevement} from '../processus/Prelevement';
import {Filtre} from '../logistique/Filtre';
import {Fichier} from '../resource/fichier/Fichier';
import {Bureau} from '../parametrage/bureau/Bureau';

export class Intervention implements IIntervention {

    id: number;
    idFranchise: number;
    idChantier: number;
    idDevisCommande: number;
    idOrdreIntervention: number;
    ordreIntervention: Fichier;
    idOrdreInterventionValide: number;
    ordreInterventionValide: Fichier;
    idOrigineValidation: number;
    idSiteIntervention: number;
    idStrategie: number;
    idRendezVous: number;
    rendezVous: RendezVous;
    prelevements: Prelevement[];
    idFacture: number;
    dateValidation: Date;
    filtres: Filtre[];
    libelle: string;
    rang: number;
    commentaire: string;
    nbPompeEnvi: number;
    nbPompeMeta: number;
    nbFiltreEnvi: number;
    nbFiltreMeta: number;
    checked: boolean;

   idStatut: number;
    idBureau: number;
    bureau: Bureau;
    siteIntervention: ISitePrelevement;
    idFiltreTemoinPI: number;
    idFiltreTemoinPPF: number;

    filtreTemoinPI: Filtre;
    filtreTemoinPPF: Filtre;
}
