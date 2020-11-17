import {IBureau} from './bureau.model';
import {IRendezVousSalle} from './rendez-vous-salle.model';

export interface ISalle {
    id: number;
    ref: string;
    libelle: string;
    place: number;
    idFranchise: number;
    rendezVousSalles: IRendezVousSalle[];
    idBureau: number;
    bureau: IBureau;
    couleur: string;
}
