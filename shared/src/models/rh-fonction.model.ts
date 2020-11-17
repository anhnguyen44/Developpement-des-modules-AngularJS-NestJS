import { Fonction, IFonction } from "./fonction.model";
import { IRessourceHumaine } from "./ressource-humaine.model";

export interface IFonctionRH {
    fonction?: IFonction;
    idFonction: number;
    rh?: IRessourceHumaine;
    idRh: number;
}