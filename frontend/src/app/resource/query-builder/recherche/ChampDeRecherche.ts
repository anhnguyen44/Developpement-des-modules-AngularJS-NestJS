
export class ChampDeRecherche {
    label: string;
    type: string;
    nom: string;
    value: any;
    list: any[] | any;
    isPourSimple: boolean;
    isPourComplexe: boolean;

    constructor(label, type, nom, isPourSimple = false, isPourComplexe = false, list: any[] | any = []) {
        this.label = label;
        this.type = type;
        this.nom = nom;
        this.isPourSimple = isPourSimple;
        this.isPourComplexe = isPourComplexe;
        this.list = list;
    }
}
