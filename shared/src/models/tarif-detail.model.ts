import {ResourceWithoutId, Resource} from './resource.model';
import { Produit, Utilisateur, TypeGrille } from '../..';
import { GrilleTarif } from './grille-tarif.model';

export interface TarifDetailFields {
    idGrilleTarif: number;
    grilleTarif: GrilleTarif;
    idProduit: number;
    produit: Produit;
    prixUnitaire: number;
    tempsUnitaire: number;
    uniteTemps: string;
    idCreatedBy: number;
    createdBy?: Utilisateur;
}

export interface ITarifDetail extends TarifDetailFields, ResourceWithoutId {}
export class TarifDetail implements TarifDetailFields, Resource {
    idGrilleTarif: number;
    grilleTarif: GrilleTarif;
    idProduit: number;
    produit: Produit;
    prixUnitaire: number;
    tempsUnitaire: number;
    uniteTemps: string;
    idCreatedBy: number;
    createdBy?: Utilisateur;
    id: number;
}
