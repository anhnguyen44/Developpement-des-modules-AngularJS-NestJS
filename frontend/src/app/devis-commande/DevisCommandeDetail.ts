import {IDevisCommandeDetail} from '@aleaac/shared';
import {DevisCommande} from './DevisCommande';
import {Produit} from '../resource/produit/Produit';

export class DevisCommandeDetail implements IDevisCommandeDetail {
    idDevisCommande: number;
    description: string;
    idProduit: number;
    montantHT: number;
    produit: Produit | null;
    quantite: number;
    totalHT: number;
    montantRemise: number;
    devisCommande: DevisCommande;
    grilleTarif: any;
    id: number;
    idGrilleTarif: number;
}
