import {ResourceWithoutId, Resource} from './resource.model';
import { Franchise, TypeGrille } from '../..';
import { TarifDetail } from './tarif-detail.model';

export interface GrilleTarifFields {
    idFranchise: number;
    franchise: Franchise;
    reference: string;
    idTypeGrille: number;
    typeGrille: TypeGrille;
    conditions: string;
    commentaire: string;
    details: TarifDetail[];
    isGrillePublique: boolean;
}

export interface IGrilleTarif extends GrilleTarifFields, ResourceWithoutId {}
export class GrilleTarif implements GrilleTarifFields, Resource {
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
