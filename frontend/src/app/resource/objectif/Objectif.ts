import {IObjectif, TypeObjectif, MomentObjectif} from '@aleaac/shared';
import { EnumSimulationObligatoire } from '@aleaac/shared/src/models/objectif.model';


export class Objectif implements IObjectif {
    hasTempsCalcule: boolean;
    simulationObligatoire: EnumSimulationObligatoire;
    duree: string;
    frequence: string;
    isPeriodique: boolean;
    conditionsApplication: string;

    code: string;
    nom: string;    description: string;
    lettre: string;
    type: TypeObjectif;
    idType: number;
    momentObjectif: MomentObjectif;
    idMomentObjectif: number;
    isMesureOperateur: boolean;
    isObligatoireCOFRAC: boolean;
    SAFibreParLitre: number;
    limiteSup: number;
    id?: number | undefined;
}

