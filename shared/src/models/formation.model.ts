import {ResourceWithoutId, Resource} from './resource.model';
import { Produit } from './produit.model';
import { ITypeFormation } from './typeFormation.model';
import { ISalle } from './salle.model';
import { IUtilisateur } from './utilisateur.model';
import { IContact } from './contact.model';
import { FormationContact, IFormationContact } from './formation-contact.model';
import { IFranchise } from './franchise.model';
import { IBureau } from './bureau.model';
import { IFormateurFormation } from './formateur-formation.model';



export interface FormationFields {
    nbrJour:number
    dateDebut: Date;
    typeFormation: ITypeFormation;
    dateFin: Date;
    salle: ISalle;
    bureau: IBureau;
    formateur?: IFormateurFormation[];
    commentaire: string;
    stagiaire: IFormationContact[];
    idFranchise: number; 
    franchise?: IFranchise; 
    idStatutFormation: EnumStatutSessionFormation;
    phrCertificat: string;
    heureDebutForma: string;
    heureFinForma: string;
    idSalle?:number;
    idBureau?:number
    idTypeFormation?:number;
}

export interface IFormation extends FormationFields, ResourceWithoutId {}
export class Formation implements FormationFields, Resource {
    id: number;
    nbrJour:number
    dateDebut: Date;
    idTypeFormation?:number;
    typeFormation: ITypeFormation;
    dateFin: Date;
    idSalle?:number;
    salle: ISalle;
    idBureau?:number
    bureau: IBureau;
    formateur?: IFormateurFormation[];
    commentaire: string;
    // stagiaire: boolean;
    stagiaire: IFormationContact[];
    periodeTemp?: any[];
    idFranchise: number;
    franchise?: IFranchise;
    idStatutFormation: EnumStatutSessionFormation;
    phrCertificat: string;
    heureDebutForma: string;
    heureFinForma: string;
}

export enum EnumStatutSessionFormation{
    PREVISIONNELLE = 1,
    PLANIFIEE = 2,
    TERMINEE = 3,
}