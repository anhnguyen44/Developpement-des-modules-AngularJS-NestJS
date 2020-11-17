// import {IsString, IsInt} from 'class-validator';

import {IUtilisateur} from '../../models/utilisateur.model';
import {
    ICivilite,
    IQualite,
    IFranchise,
    CUtilisateurProfil,
    Utilisateur,
    Franchise,
    Civilite,
    Qualite,
    Profil,
    IFichier,
    ProfilsDroits
} from '../../..';
import { Historique } from '../../models/historique.model';
import { Adresse } from '../../models/adresse.model';
import { Fonction } from '../../models/fonction.model';
export class UpdateUtilisateurDto implements IUtilisateur {
  tokenResetPassword: string;
  dateDemandeResetPassword: Date;
  dateResetPassword: Date;
  ipResetPassword: string;
  fonction: Fonction;
  listeProfil?: Profil[] | undefined;
  civilite: Civilite;  qualite: Qualite;
  nom: string;
  prenom: string;
  raisonSociale?: string;
  telephone?: string;
  mobile?: string;
  fax?: string;
  createdBy?: Utilisateur;
  adresse: Adresse;
  login: string;
  motDePasse: string;
  loginGoogleAgenda?: string;
  isSuspendu: boolean;
  utilisateurParent?: Utilisateur;
  franchisePrincipale?: Franchise;
  isHabilite: boolean;
  niveauHabilitation?: number;
  dateValiditeHabilitation?: Date;
  profils?: CUtilisateurProfil[];
  isInterne: boolean;
  historiques: Historique[];
  id?: number;
  signature: IFichier;
  idSignature: number;
  listeProfilsDroits?: ProfilsDroits[];
}
