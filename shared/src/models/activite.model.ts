import {IFranchise} from './franchise.model';
import {IContact} from './contact.model';
import {IAdresse} from './adresse.model';
import {IUtilisateur} from './utilisateur.model';
import {ICategorie} from './categorie.model';

export interface IActivite {

    id: number,
    idFranchise: number,
    franchise: IFranchise,
    idCategorie: number,
    categorie: ICategorie,
    idContact: number,
    contact: IContact,
    idAdresse: number,
    adresse: IAdresse,
    objet: string,
    contenu: string,
    date: string,
    time: string,
    duree: number,
    idUtilisateur: number,
    utilisateur: IUtilisateur
}
