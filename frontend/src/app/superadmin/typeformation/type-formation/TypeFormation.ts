import { ITypeFormation, Produit, IDomaineCompetence, TypeFormationDCompetence } from '@aleaac/shared';

export class TypeFormation implements ITypeFormation {
    id: number;
    cateFormation: string;
    nomFormation: string;
    phrFormation: string;
    foncCible: string;
    product: Produit | null;
    // idProduit: number | null;
    phrDiplome: string;
    dureeEnJour: number;
    dureeEnHeure: number;
    dureeValidite: number;
    delaiAmerte: number;
    interne: boolean;
    referentielUtilise: string;
    dCompetence?: TypeFormationDCompetence[];
    // dCPratique?: TypeFormationDCompetence[];
    // dCTheorique?: TypeFormationDCompetence[];
    listPratique?: IDomaineCompetence[];
    listTheorique?: IDomaineCompetence[];
    typeEvaluationPratique: string;
    typeEvaluationTheorique: string;
}
