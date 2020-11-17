import { IPompe } from './pompe.model';
import { IRendezVous } from './rendez-vous.model';

export interface IRendezVousPompe {
    id: number;
    idPompe: number;
    pompe: IPompe;
    idRendezVous: number;
    rendezVous: IRendezVous;

}
