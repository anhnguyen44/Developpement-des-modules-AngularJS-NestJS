import { IFormationValideRH, IRessourceHumaine, IFormation, ITypeFormation } from "@aleaac/shared";


export class FormationValideRH implements IFormationValideRH{
    rh?: IRessourceHumaine;
    idRh : number;
    formation?: ITypeFormation;
    idTypeFormation:number;
    dateObtenu: Date;
    habilite:boolean;
}