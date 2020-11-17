import {IContact} from './contact.model';
import {IDevisCommande} from './devis-commande.model';
import {ITypeContactDevisCommande} from './type-contact-devis-commande.model';

export interface IContactDevisCommande {
    id: number;
    idContact: number;
    contact: IContact;
    idDevisCommande: number;
    devisCommande: IDevisCommande;
    idTypeContactDevisCommande: number;
    typeContactDevisCommande: ITypeContactDevisCommande;
}
