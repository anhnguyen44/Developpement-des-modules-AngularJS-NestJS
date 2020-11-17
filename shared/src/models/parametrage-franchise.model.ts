import {ResourceWithoutId, Resource} from './resource.model';
import { IFranchise } from './franchise.model';

export interface ParametrageFranchiseFields {
    franchise: IFranchise;
    nom: string;
    valeur: string;
}

export interface IParametrageFranchise extends ParametrageFranchiseFields, ResourceWithoutId {}
export class ParametrageFranchise implements ParametrageFranchiseFields, Resource {
    franchise: IFranchise;
    nom: string;
    valeur: string;
    id: number;
}