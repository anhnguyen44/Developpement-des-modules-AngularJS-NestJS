import { ITarifDetail, GrilleTarif, Produit, Utilisateur, TypeGrille } from '@aleaac/shared';

export class TarifDetail implements ITarifDetail {
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
    tarifPublique?: TarifDetail;
}
