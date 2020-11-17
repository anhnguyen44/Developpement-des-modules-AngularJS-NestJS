export interface IStatutStrategie {
    id: number;
    nom: string;
    description: string;
    ordre: number;
    parent: IStatutStrategie;
    isJustificationNecessaire: boolean;
}

export class StatutStrategie implements IStatutStrategie {
    id: number;
    nom: string;
    description: string;
    ordre: number;
    parent: StatutStrategie;
    isJustificationNecessaire: boolean;
}

export enum EnumStatutStrategie {
    Unset = 0,
    STRAT_A_REALISER = 1,
    STRAT_A_VALIDER = 2,
    STRAT_VALIDEE = 3,
    STRAT_DEVIS_EN_COURS = 4,
    STRAT_DEVIS_ENVOYE = 5,
    STRAT_DEVIS_RELANCE = 6,
    STRAT_INTERV_EN_COURS = 7,
    STRAT_RF_A_REALISER = 8,
    STRAT_RF_A_VALIDER = 9,
    STRAT_RF_ENVOYE = 10,
}
