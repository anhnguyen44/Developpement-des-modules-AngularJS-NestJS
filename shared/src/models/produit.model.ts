import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';
import { Utilisateur } from './utilisateur.model';
import { Franchise } from './franchise.model';
import { TypeProduit } from './type-produit.model';


export interface ProduitFields {
    nom: string;
    code: string;
    description: string;
    prixUnitaire: number;
    hasTemps: boolean;
    tempsUnitaire: number;
    uniteTemps: string;
    isGeneral: boolean;
    idCreatedBy: number;
    createdBy?: Utilisateur;
    idFranchise: number;
    franchise?: Franchise;
    type: TypeProduit;
    idType: number;
    rang: number;
}

export interface IProduit extends ProduitFields, ResourceWithoutId {}
export class Produit implements ProduitFields, Resource {
    rang: number;
    type: TypeProduit;
    idType: number;
    id: number;
    nom: string;
    code: string;
    description: string;
    prixUnitaire: number;
    hasTemps: boolean;
    tempsUnitaire: number;
    uniteTemps: string;
    isGeneral: boolean;
    idCreatedBy: number;
    createdBy?: Utilisateur;
    idFranchise: number;
    franchise?: Franchise;
}
