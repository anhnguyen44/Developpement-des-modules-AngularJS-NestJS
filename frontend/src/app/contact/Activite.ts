import { IActivite, Utilisateur } from '@aleaac/shared';
import { Adresse } from '../parametrage/bureau/Adresse';
import { Categorie } from './Categorie';
import { Contact } from './Contact';

export class Activite implements IActivite {
    adresse: Adresse;
    idCategorie: number;
    categorie: Categorie;
    contact: Contact;
    contenu: string;
    date: string;
    time: string;
    duree: number;
    franchise;
    id: number;
    idAdresse: number;
    idContact: number;
    idFranchise: number;
    idUtilisateur: number;
    objet: string;
    utilisateur: Utilisateur;
}
