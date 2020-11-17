import {IContactDevisCommande} from '@aleaac/shared';
import {Contact} from '../contact/Contact';
import {DevisCommande} from './DevisCommande';
import {TypeContactDevisCommande} from './TypeContactDevisCommande';

export class ContactDevisCommande implements IContactDevisCommande {
    id: number;
    contact: Contact;
    devisCommande: DevisCommande;
    idContact: number;
    idDevisCommande: number;
    idTypeContactDevisCommande: number;
    typeContactDevisCommande: TypeContactDevisCommande;
}
