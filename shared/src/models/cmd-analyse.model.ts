import { IChantier } from './chantier.model';
import {IPrelevement} from './prelevement.model';


export interface ICmdAnalyse {
    id: number,
    idChantier: number,
    chantier: IChantier
    idTypePrelevement: number,
    dateEnvoi: Date,
    dateRetour: Date,
    prelevements: IPrelevement[],
}
