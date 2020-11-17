import {IRendezVous} from './rendez-vous.model';
import {ISalle} from './salle.model';

export interface IRendezVousSalle {

    id: number;
    idSalle: number;
    salle: ISalle;
    idRendezVous: number;
    rendezVous: IRendezVous;

}
