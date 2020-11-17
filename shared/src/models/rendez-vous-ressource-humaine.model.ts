import {IRendezVous} from './rendez-vous.model';
import {IRessourceHumaine} from './ressource-humaine.model';

export interface IRendezVousRessourceHumaine {

    id: number;
    idRessourceHumaine: number;
    ressourceHumaine: IRessourceHumaine;
    idRendezVous: number;
    rendezVous: IRendezVous;

}
