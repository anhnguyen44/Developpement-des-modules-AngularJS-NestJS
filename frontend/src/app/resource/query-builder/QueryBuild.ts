export class QueryBuild {
    constructor(parPage?: number | null, pageEnCours?: number | null, dd?, df?, ddColonne?, dfColonne?, colonne?,
                idParent?, nomCleParent?, nomCleIsNull?, nomCleStatut?, idStatut?, nonPreleve?) {
        this.parPage = parPage;
        this.pageEnCours = pageEnCours;
        this.dd = dd;
        this.df = df;
        this.ddColonne = ddColonne;
        this.dfColonne = dfColonne;
        this.colonne = colonne;
        this.idParent = idParent;
        this.nomCleParent = nomCleParent;
        this.nomCleIsNull = nomCleIsNull;
        this.nomCleStatut = nomCleStatut;
        this.idStatut = idStatut;
        this.nonPreleve = nonPreleve;

    }
    type: string;
    stringRecherche: string;
    order: string;
    sensOrder: string;
    parPage: number | null | undefined = 10;
    pageEnCours: number | null | undefined = 1;
    needCount: boolean = false;
    dd: string;
    ddColonne: string;
    df: string;
    dfColonne: string;
    colonne: string;
    idParent: number;
    nomCleParent: string;
    idsExclude: any[];
    nomCleExclude: string;
    nomCleIsNull: string;
    nomCleStatut: string;
    idStatut: number;
    nonPreleve: boolean;
    idsWhereIn: any[];
    nomCleWhereIn: string;
}

export interface QueryBuildable {
    queryBuild: QueryBuild;
    setQueryBuild(queryBuild): void;
}
