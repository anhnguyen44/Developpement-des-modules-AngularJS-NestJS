import {ISalle} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';
import {RendezVousPompe} from './RendezVousPompe';
import {RendezVousSalle} from './RendezVousSalle';

export class Salle implements ISalle {
    bureau: Bureau;
    id: number;
    idBureau: number;
    libelle: string;
    place: number;
    ref: string;
    idFranchise: number;
    couleur: string;
    checked: boolean;
    rendezVousSalles: RendezVousSalle[];
}
