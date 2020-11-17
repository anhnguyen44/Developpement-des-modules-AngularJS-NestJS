export interface ITypeFichierGroupe {
    nom: string,
}
export class TypeFichierGroupe implements ITypeFichierGroupe {
    id: number;
    nom: string;
}

export enum EnumTypeFichierGroupe {
    DEVIS = 1,
    CHANTIER = 2,
    STRATEGIE = 3,
    ACTIVITE = 4,
    IMPORT = 5,
    USER = 6,
    STAGIAIRE = 7,
}
