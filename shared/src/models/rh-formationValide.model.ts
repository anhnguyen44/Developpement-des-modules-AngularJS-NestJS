import { IRessourceHumaine } from "./ressource-humaine.model";
import { IFormation } from "./formation.model";
import { ITypeFormation } from "../..";


export interface IFormationValideRH{
    rh?: IRessourceHumaine;
    idRh: number;
    formation?: ITypeFormation;
    idTypeFormation:number;
    dateObtenu: Date;
    habilite:boolean;
} 