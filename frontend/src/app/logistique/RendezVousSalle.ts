import {IRendezVousSalle} from '@aleaac/shared';
import {RendezVous} from './RendezVous';
import {Salle} from './Salle';

export class RendezVousSalle implements IRendezVousSalle {
    id: number;
    idSalle: number;
    idRendezVous: number;
    salle: Salle;
    rendezVous: RendezVous;
}
