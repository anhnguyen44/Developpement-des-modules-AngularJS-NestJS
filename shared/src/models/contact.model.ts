import {IQualite, Qualite} from './qualite.model';
import {ICivilite, Civilite} from './civilite.model';
import {IAdresse, Adresse} from './adresse.model';
import {IBureau} from './bureau.model';
import {IFranchise} from './franchise.model';
import {IUtilisateur, Utilisateur} from './utilisateur.model';
import { ICompte } from './compte.model';

export interface IContact {
    id: number,
    idBureau?: number,
    bureau?: IBureau,
    idFranchise?: number,
    franchise: IFranchise,
    idQualite: number,
    qualite: IQualite,
    idCivilite?: number | null,
    civilite?: ICivilite | null,
    idUtilisateur?: number | null;
    utilisateur?: IUtilisateur | null;
    nom: string,
    prenom: string,
    portable: string,
    idAdresse?: number,
    adresse?: IAdresse,
    bProspect: boolean,
    phase: string,
    objectif: string,
    qualification: string,
    secteur: string,
    anniversaire: Date,
    editeur: string,
    application: string,
    commentaire: string,
    isLinked: boolean
}

export class Contact implements IContact {

    id: number;
    adresse: Adresse;
    civilite: Civilite;
    idAdresse: number;
    idCivilite: number;
    idQualite: number;
    utilisateur: Utilisateur;
    idUtilisateur: number;
    application: string;
    nom: string;
    prenom: string;
    qualite: Qualite;
    anniversaire: Date;
    bProspect: boolean;
    bureau: IBureau;
    commentaire: string;
    editeur: string;
    franchise: IFranchise;
    idBureau: number;
    idFranchise: number;
    objectif: string;
    phase: string;
    portable: string;
    qualification: string;
    secteur: string;
    compteContacts: CompteContact;

    isLinked: boolean; // Pour savoir si lié à d'autres objets (devis, etc.)
}

export class CompteContact implements ICompteContact {
    bDemandeur: boolean = false;
    bDevis: boolean = false;
    bPrincipale: boolean = false;
    bFacture: boolean = false;
    bRapport: boolean = false;
    compte: ICompte;
    contact: Contact;
    idCompte: number;
    idContact: number;
}


export interface ICompteContact {
    idContact: number;
    contact: IContact;
    idCompte: number;
    compte: ICompte;
    bPrincipale: boolean;
    bDemandeur: boolean;
    bRapport: boolean;
    bDevis: boolean;
    bFacture: boolean;
}