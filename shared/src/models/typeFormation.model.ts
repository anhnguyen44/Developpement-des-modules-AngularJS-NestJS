import {ResourceWithoutId, Resource} from './resource.model';
import { Produit } from './produit.model';
import { IDomaineCompetence } from './domaine-competence.model';
import { TypeFormationDCompetence } from '../..';

export interface ITypeFormation {
    id: number,
    cateFormation: string,
    nomFormation: string,
    phrFormation: string,
    foncCible: string,
    product: Produit | null,
    // idProduit: number | null,
    phrDiplome: string,
    dureeEnJour: number,
    dureeEnHeure: number,
    dureeValidite: number,
    delaiAmerte: number,
    interne: boolean,
    referentielUtilise:string,
    // dCPratique?: TypeFormationDCompetence[],
    // dCTheorique?: TypeFormationDCompetence[],
    dCompetence?: TypeFormationDCompetence[],
    typeEvaluationPratique: string,
    typeEvaluationTheorique: string,
}



