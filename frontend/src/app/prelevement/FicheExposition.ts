import {IFicheExposition} from '@aleaac/shared';
import {Prelevement} from '../processus/Prelevement';
import {RessourceHumaine} from '../logistique/RessourceHumaine';

export class FicheExposition implements IFicheExposition {
    autreEPI: string;
    autreRisqueNuisance: string;
    date: Date;
    duree: number;
    id: number;
    idEPI: number;
    idPrelevement: number;
    idRessourceHumaine: number;
    idRisqueNuisance: number;
    prelevement: Prelevement;
    ressourceHumaine: RessourceHumaine;

}