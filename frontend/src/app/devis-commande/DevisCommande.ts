import { IDevisCommande, StatutCommande, MotifAbandonCommande } from '@aleaac/shared';
import { Bureau } from '../parametrage/bureau/Bureau';
import { Contact } from '../contact/Contact';
import { DevisCommandeDetail } from './DevisCommandeDetail';
import { Adresse } from '../parametrage/bureau/Adresse';
import { ContactDevisCommande } from './ContactDevisCommande';

export class DevisCommande implements IDevisCommande {
    bureau: Bureau;
    contact: Contact;
    mission: string;
    devisCommandeDetails: DevisCommandeDetail[];
    id: number;
    idBureau: number;
    idFranchise: number;
    ref: number;
    statut: StatutCommande;
    idStatutCommande: number;
    raisonStatutCommande: string;
    tauxTVA: number;
    totalTVA: number;
    totalRemiseHT: number;
    totalHT: number;
    totalTTC: number;
    typeDevis: number;
    version: number;
    versionFigee: boolean;
    isModifie: boolean;
    dateCreation: Date;
    commentaireInterne: string;
    commentaireDevis: string;
    selected: boolean;
    motifAbandonCommande: MotifAbandonCommande;
    idMotifAbandonCommande: number;
    adresse: Adresse;
    idAdresse: number;
    contactDevisCommandes: ContactDevisCommande[];

    // non géré par relations, uniquement pour la recherche
    idChantier?: number | null;
    idFormation?: number | null;
}
