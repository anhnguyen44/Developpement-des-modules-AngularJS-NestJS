import { ITypeFormation } from "./typeFormation.model";
import { IDomaineCompetence } from "./domaine-competence.model";
import { INoteCompetenceStagiaire } from "./noteCompetenceStagiaire.model";


export interface TypeFormationDCompetence{
    id:number,
    typeFormation?: ITypeFormation,
    idTypeFormation: number,
    dCompetence?: IDomaineCompetence,
    idDCompetence: number,
    typePratique: boolean,
}