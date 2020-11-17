import {IContact} from './contact.model';
import {ICompte} from './compte.model';


export interface ICompteContact {
    idContact: number;
    contact: IContact;
    idCompte: number;
    compte: ICompte;
    bPrincipale: boolean;
    bDemandeur: boolean;
    bRapport: boolean;
    bDevis: boolean;
    bFacture: boolean;
}
