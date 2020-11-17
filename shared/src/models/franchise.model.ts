import {ResourceWithoutId, Resource} from './resource.model';
import {ICivilite} from './civilite.model';
import { CUtilisateurProfil } from './utilisateur-profil.model';
import { IParametrageFranchise } from './parametrage-franchise.model';
import { IUtilisateur, Utilisateur } from './utilisateur.model';


export interface FranchiseFields {
    numeroContrat: number;
    raisonSociale: string;
    statutJuridique: string;
    rcs: string;
    siret: string;
    naf: string;
    nomPrenomSignature?: string;
    numeroTVA: string;
    pourcentTVADefaut: number;
    capitalSocial: number;

    /** ASSURANCE */
    compagnieAssurance?: string;
    adresseCompagnieAssurance?: string;
    numeroContratRCP?: string;
    montantAnnuelGaranti?: string;
    dateValiditeAssurance?: Date;

    /** ADMIN */
    isSortieReseau: boolean;
    datePremiereSignature: Date | undefined;
    dateSignatureContratEnCours: Date | undefined;
    dateFinContratEnCours: Date | undefined;
    dateDemarrage: Date | undefined;
    dateSortieReseau: Date | undefined;
    trigramme: string;


    /** RELATIONS */
    utilisateurs: CUtilisateurProfil[];
    parametres: IParametrageFranchise[];
    users?: Utilisateur[];
}

export interface IFranchise extends FranchiseFields, ResourceWithoutId {}
export class Franchise implements FranchiseFields, Resource {
    users?: Utilisateur[];
    trigramme: string;
    isSortieReseau: boolean;
    datePremiereSignature: Date | undefined;
    dateSignatureContratEnCours: Date | undefined;
    dateFinContratEnCours: Date | undefined;
    dateDemarrage: Date | undefined;
    dateSortieReseau: Date | undefined;
    numeroContrat: number;
    raisonSociale: string;
    statutJuridique: string;
    rcs: string;
    siret: string;
    naf: string;
    nomPrenomSignature?: string | undefined;
    numeroTVA: string;
    pourcentTVADefaut: number = 20.0;
    utilisateurs: CUtilisateurProfil[];
    parametres: IParametrageFranchise[];
    id: number;
    
    compagnieAssurance?: string | undefined;
    adresseCompagnieAssurance?: string | undefined;
    numeroContratRCP?: string | undefined;
    montantAnnuelGaranti?: string | undefined;
    dateValiditeAssurance?: Date | undefined;

    capitalSocial: number;
}