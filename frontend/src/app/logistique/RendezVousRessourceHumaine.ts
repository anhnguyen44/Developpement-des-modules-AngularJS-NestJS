import {IRendezVousPompe, IRendezVousRessourceHumaine} from '@aleaac/shared';
import {Pompe} from './Pompe';
import {RendezVous} from './RendezVous';
import {RessourceHumaine} from './RessourceHumaine';

export class RendezVousRessourceHumaine implements IRendezVousRessourceHumaine {
    id: number;
    idRessourceHumaine: number;
    idRendezVous: number;
    ressourceHumaine: RessourceHumaine;
    rendezVous: RendezVous;
}
