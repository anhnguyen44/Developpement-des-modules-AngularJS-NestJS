import {Resource, ResourceWithoutId, Utilisateur, ParametrageFranchise, Franchise as FranchiseShared} from '@aleaac/shared';

interface FranchiseFields {
    numeroContrat: number;
    raisonSociale: string;
    statutJuridique: string;
    rcs: string;
    siret: string;
    naf: string;
    numeroTVA: string;
    nomPrenomSignature?: string;
    users: Utilisateur[];

    /** ASSURANCE */


    /** RELATIONS */
    parametres: ParametrageFranchise[];
}

export class Franchise extends FranchiseShared { }
export interface IFranchise extends ResourceWithoutId, FranchiseFields {}
