import { Resource, ResourceWithoutId } from './resource.model';
import { ICivilite, Civilite } from './civilite.model';
import { IQualite, Qualite } from './qualite.model';
import { IFranchise, Franchise } from './franchise.model';
import { CUtilisateurProfil } from './utilisateur-profil.model';
import { Historique } from './historique.model';
import { Adresse } from './adresse.model';
import { Profil } from './profil.model';
import { Fonction } from './fonction.model';
import { EnumTypeFichier } from './typeFichier.model';
import { IFichier } from './fichier.model';
import {ProfilsDroits} from './profilsDroits';

export interface UtilisateurFields {
  /** IDENTITE */
  civilite: Civilite;
  qualite: Qualite;
  fonction: Fonction;
  nom: string;
  prenom: string;
  raisonSociale?: string; // Peut-être le virer ?
  telephone?: string;
  mobile?: string;
  fax?: string;
  createdBy?: Utilisateur;
  signature: IFichier;
  idSignature: number;

  /** ADRESSE */
  adresse: Adresse;

  /** CONNEXION */
  login: string;
  motDePasse: string;
  loginGoogleAgenda?: string;
  isSuspendu: boolean;
  utilisateurParent?: Utilisateur;
  franchisePrincipale?: Franchise;

  /** DROITS */
  isHabilite: boolean;
  niveauHabilitation?: number;
  dateValiditeHabilitation?: Date;
  profils?: CUtilisateurProfil[];
  listeProfil?: Profil[];
  listeProfilsDroits?: ProfilsDroits[];
  isInterne: boolean;
  historiques: Historique[];

  tokenResetPassword: string;
  dateDemandeResetPassword: Date;
  dateResetPassword: Date;
  ipResetPassword: string;
}

export interface IUtilisateur extends UtilisateurFields, ResourceWithoutId { }
export class Utilisateur implements IUtilisateur, Resource {
  tokenResetPassword: string;
  dateDemandeResetPassword: Date;
  dateResetPassword: Date;
  ipResetPassword: string;
  fonction: Fonction;
  telephone?: string | undefined;
  fax?: string | undefined;
  civilite: Civilite;
  qualite: Qualite;
  nom: string;
  prenom: string;
  raisonSociale?: string | undefined;
  mobile?: string | undefined;
  adresse: Adresse;
  login: string;
  motDePasse: string;
  loginGoogleAgenda?: string | undefined;
  isSuspendu: boolean;
  utilisateurParent?: Utilisateur | undefined;
  franchisePrincipale?: Franchise;
  idFranchisePrincipale?: number;
  isHabilite: boolean;
  niveauHabilitation?: number | undefined;
  dateValiditeHabilitation?: Date | undefined;
  profils?: CUtilisateurProfil[] | undefined;
  listeProfilsDroits?: ProfilsDroits[];
  isInterne: boolean;
  historiques: Historique[];
  id: number;
  createdBy?: Utilisateur | undefined;
  listeProfil?: Profil[];
  motDePasseConfirmation?: string;
  signature: IFichier;
  idSignature: number;
}
