import { IGrilleTarif, Franchise, TypeGrille, TarifDetail } from '@aleaac/shared';

export class GrilleTarif implements IGrilleTarif {
    idFranchise: number;
    franchise: Franchise;
    reference: string;
    idTypeGrille: number;
    typeGrille: TypeGrille;
    conditions: string;
    commentaire: string;
    details: TarifDetail[];
    id: number;
    isGrillePublique: boolean;
}
