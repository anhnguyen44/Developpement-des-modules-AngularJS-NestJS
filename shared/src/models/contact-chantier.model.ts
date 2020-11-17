import {ResourceWithoutId, Resource} from './resource.model';
import { IContact } from './contact.model';
import { TypeContactChantier } from './type-contact-chantier.model';
import { Chantier } from './chantier.model';

export interface ContactChantierFields {
    contact: IContact;
    idContact: number;
    typeContact: TypeContactChantier;
    idTypeContact: number;
    chantier: Chantier;
    idChantier: number;
}

export interface IContactChantier extends ContactChantierFields, ResourceWithoutId {}
export class ContactChantier implements ContactChantierFields, Resource {
    contact: IContact;
    idContact: number;
    typeContact: TypeContactChantier;
    idTypeContact: number;
    chantier: Chantier;
    idChantier: number;
    id: number;
}
