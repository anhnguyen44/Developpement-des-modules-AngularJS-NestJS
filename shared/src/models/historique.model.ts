import {IUtilisateur} from './utilisateur.model';

export interface IHistorique {
    id: number,
    idUtilisateur?: number,
    utilisateur?: IUtilisateur,
    date: Date,
    application: string,
    idParent: number,
    description: string
}

export class Historique implements IHistorique {
    id: number;
    idUtilisateur?: number | undefined;
    utilisateur?: IUtilisateur | undefined;
    date: Date;
    application: string;
    idParent: number;
    description: string;
}