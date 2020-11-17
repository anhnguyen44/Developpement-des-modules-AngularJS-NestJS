import {IBureau} from './bureau.model';

export interface IConsommable {
    id: number;
    ref: string;
    libelle: string;
    nombreParCommande: number;
    stock: number;
    idFranchise: number;
    idBureau: number;
    bureau: IBureau
}