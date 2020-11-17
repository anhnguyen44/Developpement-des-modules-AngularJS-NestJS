import { EnumTypeFichierGroupe, TypeFichierGroupe } from "./typeFichierGroupe.model";

export interface ITypeFichier {
    id: number,
    nom: string,
    affectable: boolean,
    groupe: TypeFichierGroupe | null;
}

export enum EnumTypeFichier {
    CMD_DEVIS = 1,
    CMD_STRATEGIE = 2,
    CMD_PLAN = 3,
    AUTRE = 4,
    CHANTIER_PJ_SITE_PRELEVEMENT = 5,
    CHANTIER_PLAN_BATIMENT = 6,
    CHANTIER_PDRE_SS3 = 7,
    CHANTIER_LISTE_PROCESS = 8,
    CHANTIER_MODE_OP = 9,
    CHANTIER_PIC = 10,
    CHANTIER_PLANNING_INFO = 11,
    CHANTIER_REPERAGE_AMIANTE = 12,
    CHANTIER_PHOTOS = 13,
    CHANTIER_PLANS = 14,
    CHANTIER_PDRE_CSP = 15,
    ACTIVITE_DEVIS = 16,
    ACTIVITE_STRATEGIE = 17,
    ACTIVITE_PLAN = 18,
    IMPORT_LISTE_AMIANTE = 19,
    IMPORT_LISTE_ENRICHISSABLE = 20,
    CHANTIER_PLAN_PERIMETRE = 21,
    CHANTIER_PLAN_PERIMETRE_BATIMENT = 22,
    ORDRE_INTERVENTION = 23,
    TEMPLATE = 24,
    ORDRE_INTERVENTION_VALIDE = 25,
    CHANTIER_STRATEGIE = 26,
    USER_SIGNATURE = 27,
    CHANTIER_PLAN_PRELEVEMENTS = 28,
    DOCUMENT_ATTACHE = 29,
}