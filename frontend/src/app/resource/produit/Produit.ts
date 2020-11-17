import {IProduit, Utilisateur, Franchise, TypeProduit} from '@aleaac/shared';


export class Produit implements IProduit {
    type: TypeProduit;
    idType: number;
    code: string;
    createdBy: Utilisateur;
    description: string;
    franchise: Franchise;
    hasTemps: boolean;
    id: number;
    idCreatedBy: number;
    idFranchise: number;
    isGeneral: boolean;
    nom: string;
    prixUnitaire: number;
    tempsUnitaire: number;
    uniteTemps: string;
    rang: number;
}

