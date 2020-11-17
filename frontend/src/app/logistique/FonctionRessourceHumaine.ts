import { IFonction, IRessourceHumaine, IFonctionRH } from "@aleaac/shared";
import { RessourceHumaine } from "./RessourceHumaine";
import { Fonction } from "@aleaac/shared/src/models/fonction.model";


export class FonctionRH implements IFonctionRH{
    fonction?: IFonction;
    idFonction: number;
    rh?: IRessourceHumaine;
    idRh: number;
}