import { IRendezVousPompe } from '@aleaac/shared';
import { Pompe } from './Pompe';
import { RendezVous } from './RendezVous';

export class RendezVousPompe implements IRendezVousPompe {
    id: number;
    idPompe: number;
    idRendezVous: number;
    pompe: Pompe;
    rendezVous: RendezVous;
}
