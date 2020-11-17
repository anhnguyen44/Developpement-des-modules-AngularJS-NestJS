import { IFormationContact } from "./formation-contact.model";
import { TypeFormationDCompetence } from "../..";

export interface INoteCompetenceStagiaire{
    id: number,
    idStagiaire: number,
    stagiaire?: IFormationContact,
    idCompetence: number,
    competence?: TypeFormationDCompetence,
    note: number
}

export class NoteCompetenceStagiaire{
    id: number;
    idStagiaire: number;
    stagiaire?: IFormationContact;
    idCompetence: number;
    competence?: TypeFormationDCompetence;
    note: number;
}