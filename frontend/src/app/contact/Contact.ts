import {IFranchise, IContact, Utilisateur} from '@aleaac/shared';
import {Adresse} from '../parametrage/bureau/Adresse';
import {Civilite} from '../resource/civilite/Civilite';
import {Qualite} from '../resource/qualite/Qualite';
import {Bureau} from '../parametrage/bureau/Bureau';
import {CompteContact} from './CompteContact';

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
    bureau: Bureau;
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
