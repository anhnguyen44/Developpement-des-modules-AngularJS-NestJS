export interface IStatutCommande {
    id: number;
    nom: string;
    description: string;
    ordre: number;
    parent: IStatutCommande;
    isJustificationNecessaire: boolean;
}

export class StatutCommande implements IStatutCommande {
    id: number;
    nom: string;
    description: string;
    ordre: number;
    parent: StatutCommande;
    isJustificationNecessaire: boolean;
}

export enum EnumStatutCommande {
    Unset = 0,
    DEVIS_EN_SAISIE = 1,
    DEVIS_ENVOYE = 2,
    DEVIS_RELANCE = 3,
    LABO_DEVIS_EN_PROD = 4,
    LABO_STRAT_A_REALISER = 5,
    LABO_STRAT_VALIDEE = 6,
    LABO_DEVIS_EN_COURS = 7,
    LABO_DEVIS_ENVOYE = 8,
    LABO_DEVIS_RELANCE = 9,
    DEVIS_EN_COURS_CLIENT = 10,
    COMMANDE_EN_SAISIE = 11,
    COMMANDE_PLANIFIEE = 12,
    COMMANDE_TERMINEE = 13,
    DEVIS_ABANDONNE = 14,
    COMMANDE_ABANDONNE = 15,
}