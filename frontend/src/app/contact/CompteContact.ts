import {ICompteContact} from '@aleaac/shared';
import {Compte} from './Compte';
import {Contact} from './Contact';

export class CompteContact implements ICompteContact {
    bDemandeur: boolean = false;
    bDevis: boolean = false;
    bPrincipale: boolean = false;
    bFacture: boolean = false;
    bRapport: boolean = false;
    compte: Compte;
    contact: Contact;
    idCompte: number;
    idContact: number;
}
