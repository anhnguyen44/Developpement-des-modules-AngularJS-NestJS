import { IRessourceHumaine } from "./ressource-humaine.model";
import { IFormation } from "./formation.model";


export interface IFormateurFormation{
    id:number;
    idFormateur: number;
    formateur?: IRessourceHumaine;
    idFormation: number;
    Formation?:IFormation;
}