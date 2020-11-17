import {IUtilisateur} from './utilisateur.model';
import {ITypeFichier} from './typeFichier.model';

export interface IFichier {
    id: number,
    nom: string,
    idUtilisateur: number,
    date: Date,
    extention: string,
    application: string,
    idParent: number,
    keyDL?: string,
    idTypeFichier: number,
    typeFichier: ITypeFichier
    commentaire?: string;
}

