import {IBureau} from './bureau.model';
import {ILotFiltre} from './lot-filtre.model';
import {IIntervention} from './intervention.model';
import {IPrelevement} from './prelevement.model';


export interface IFiltre {
    id: number;
    ref: string;
    idBureau: number;
    bureau: IBureau
    idFranchise: number;
    idLotFiltre: number;
    idChantier: number;
    isBlanc: boolean;
    idTypeFiltre: number;
    lotFiltre: ILotFiltre;
}
