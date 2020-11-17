import {IConsommable} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';

export class Consommable implements IConsommable{
    bureau: Bureau;
    id: number;
    idBureau: number;
    libelle: string;
    nombreParCommande: number;
    stock: number;
    ref: string;
    idFranchise: number;
}