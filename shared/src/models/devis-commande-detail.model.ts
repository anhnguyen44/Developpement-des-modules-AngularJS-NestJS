import {IProduit} from './produit.model';
import {IDevisCommande} from './devis-commande.model';

export interface IDevisCommandeDetail {
    id: number;
    idDevisCommande: number;
    description: string;
    devisCommande: IDevisCommande;
    idProduit: number;
    produit: IProduit | null;
    montantHT: number;
    montantRemise: number;
    quantite: number;
    totalHT: number;
}