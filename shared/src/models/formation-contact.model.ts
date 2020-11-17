import { IFormation, Formation } from "./formation.model";
import { IContact, CompteContact } from "./contact.model";
import { ICompte } from "./compte.model";
import { IFichier } from "./fichier.model";
import { INoteCompetenceStagiaire } from "./noteCompetenceStagiaire.model";
import { IDevisCommande } from "./devis-commande.model";


export interface IFormationContact{
    formation?: IFormation;
    idFormation: number;
    contact: IContact;
    sousTraitance: ICompte;
    rattrapage: number;
    absenceTotal: boolean;
    absencePartielle: number;
    formationValide?:boolean;
    numCertificat?:number;
    numForprev?:number;
    phraseForprev?:string;
    noteObtenu?:number;
    delivrerLe?:Date;
    dossierComplet:IFichier;
    idDevis: number;
    noteCompetence?:INoteCompetenceStagiaire[];
    dateEnvoiDossier?:Date;
    // idSousTraitance?:number;
    // idDossierComplet?:number;
}

export class FormationContact{
    id:number;
    formation?: IFormation;
    idFormation: number;
    contact: IContact;
    sousTraitance: ICompte;
    rattrapage: number;
    absenceTotal: boolean;
    absencePartielle: number;
    formationValide?:boolean;
    numCertificat?:number;
    numForprev?:number;
    phraseForprev?:string;
    noteObtenu?:number;
    delivrerLe?:Date;
    dossierComplet:IFichier;
    checked:number;
    idDevis: number;
    noteCompetence?:INoteCompetenceStagiaire[];
    pratiqueFavorable?:boolean;
    theoriqueFavorable?:boolean;
    favorable?:boolean;
    dateEnvoiDossier?:Date;
    
}