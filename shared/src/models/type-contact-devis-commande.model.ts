export interface ITypeContactDevisCommande {
    id: number;
    nom: string;
    code: string;
    isInterne: boolean;
}

export enum EnumTypeContactDevisCommande {
    CHARGE_CLIENTELE = 1,
    STRATEGE = 2,
    REDEACTEUR_STRATEGIE = 3,
    VALIDATEUR_STRATEGIE = 4,
    FORMATEUR = 5,
    CLIENT = 6,
    DONNEUR_ORDRE = 7,
    MAITRE_OUVRAGE = 8,
    PROPRIETAIRE = 9,
    STAGIAIRE = 10,
    PRESCRIPTEUR = 11,
}
