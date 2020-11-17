import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { Utilisateur } from './utilisateur.model';
import { Franchise } from './franchise.model';
import {IContact, GrilleTarif, StatutCommande, IDevisCommande, IIntervention, IFichier} from '../..';
import { SitePrelevement } from './site-prelevement.model';
import { BesoinClientLabo } from './besoin-client-labo.model';
import { IBureau } from './bureau.model';
import { ContactChantier } from './contact-chantier.model';
import { MotifAbandonCommande } from './motif-abandon-commande.model';
import { Contact } from './contact.model';
import { Strategie } from './strategie.model';


export interface ChantierFields {
    reference: number;
    franchise: Franchise;
    idFranchise: number;
    bureau: IBureau;
    idBureau: number;
    nomChantier: string;
    client: IContact;
    idClient: number;
    contacts: ContactChantier[]; // +rapport à remettre à
    chargeClient: Utilisateur;
    idChargeClient: number;
    redacteurStrategie: Utilisateur;
    idRedacteurStrategie: number;
    valideurStrategie: Utilisateur;
    idValideurStrategie: number;
    tarif: GrilleTarif;
    idTarif: number;
    statut: StatutCommande; // Ceux qui sont avec le prefixe LABO_
    idStatut: number;
    dateReceptionDemande: Date;
    dateDevisSouhaitee: Date;
    dateStrategieSouhaitee: Date;
    dateDernierPrelevement: Date;
    dateCommande: Date;
    dateEmissionRapport: Date;
    dateMiseADispoDernierRE: Date;
    debutPeriodeIntervention: Date;
    finPeriodeIntervention: Date;
    datePreviDemarrage:  Date;
    datePreviFinChantier: Date;

    sitesPrelevement: SitePrelevement[];
    besoinClient: BesoinClientLabo;
    idBesoinClient: number;

    createdAt?: Date;
    updatedAt?: Date;

    raisonStatutCommande: string;
    idMotifAbandonCommande: number;
    motifAbandonCommande: MotifAbandonCommande;
    listeDevisCommande: IDevisCommande[];
    strategies: Strategie[];

    // fichier Ordre intervention
    idOrdreInterventionGlobal: number;
    ordreInterventionGlobal: IFichier;
    idOrdreInterventionGlobalSigne: number;
    ordreInterventionGlobalSigne: IFichier;

    versionStrategie: number;
    isCOFRAC: boolean; // Utilisé pour générer la stratégie
    justifNonCOFRAC: string; // Utilisé pour générer la stratégie
    hasRDVPrealable: boolean; // Utilisé pour générer la stratégie
    txtRDVPrealable: string; // Utilisé pour générer la stratégie

    commentaire: string;
}

export interface IChantier extends ChantierFields, ResourceWithoutId {}
export class Chantier implements ChantierFields, Resource {
    strategies: Strategie[];
    raisonStatutCommande: string;
    idMotifAbandonCommande: number;
    motifAbandonCommande: MotifAbandonCommande;
    createdAt?: Date;
    updatedAt?: Date;
    idBesoinClient: number;
    idStatut: number;
    idChargeClient: number;
    idRedacteurStrategie: number;
    idValideurStrategie: number;
    bureau: IBureau;
    idClient: number;
    reference: number;
    franchise: Franchise;
    idFranchise: number;
    idBureau: number;
    nomChantier: string;
    client: Contact;
    contacts: ContactChantier[];
    chargeClient: Utilisateur;
    redacteurStrategie: Utilisateur;
    valideurStrategie: Utilisateur;
    tarif: GrilleTarif;
    idTarif: number;
    statut: StatutCommande;
    dateReceptionDemande: Date;
    dateDevisSouhaitee: Date;
    dateStrategieSouhaitee: Date;
    dateDernierPrelevement: Date;
    dateCommande: Date;
    dateEmissionRapport: Date;
    dateMiseADispoDernierRE: Date;
    debutPeriodeIntervention: Date;
    finPeriodeIntervention: Date;
    datePreviDemarrage: Date;
    datePreviFinChantier: Date;
    sitesPrelevement: SitePrelevement[];
    besoinClient: BesoinClientLabo;
    id: number;
    listeDevisCommande: IDevisCommande[];
    interventions: IIntervention[];
    // fichier Ordre intervention
    idOrdreInterventionGlobal: number;
    ordreInterventionGlobal: IFichier;
    idOrdreInterventionGlobalSigne: number;
    ordreInterventionGlobalSigne: IFichier;

    versionStrategie: number;
    isCOFRAC: boolean; // Utilisé pour générer la stratégie
    justifNonCOFRAC: string; // Utilisé pour générer la stratégie
    hasRDVPrealable: boolean; // Utilisé pour générer la stratégie
    txtRDVPrealable: string; // Utilisé pour générer la stratégie

    commentaire: string;
}
