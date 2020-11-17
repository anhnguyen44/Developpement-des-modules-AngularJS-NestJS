import { IBureau } from './bureau.model';
import { IContact } from './contact.model';
import { IDevisCommandeDetail } from './devis-commande-detail.model';
import { StatutCommande } from './statut-commande.model';
import { MotifAbandonCommande } from './motif-abandon-commande.model';
import { Adresse } from './adresse.model';


export interface IDevisCommande {
    id: number;
    idFranchise: number;
    typeDevis: number;
    ref: number;
    idBureau: number;
    bureau: IBureau;
    devisCommandeDetails: IDevisCommandeDetail[];
    version: number;
    versionFigee: boolean;
    isModifie: boolean;
    statut: StatutCommande;
    raisonStatutCommande: string;
    idStatutCommande: number;
    tauxTVA: number;
    totalTVA: number;
    totalHT: number;
    totalRemiseHT: number;
    mission: string;
    totalTTC: number;
    dateCreation: Date;
    commentaireInterne: string;
    commentaireDevis: string;
    motifAbandonCommande: MotifAbandonCommande;
    idMotifAbandonCommande: number;
    adresse: Adresse;
    idAdresse: number;

    // non géré par relations, juste pour la recherche
    idChantier?: number | null;
    idFormation?: number | null;

}

export enum EnumTypeDevis {
    LABO = 1,
    FORMATION = 2,
    CONSEIL = 3,
    BIM = 4,
    CONTROLES = 5,
    LIBRE = 6
}