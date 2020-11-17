import {IFiltre} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';
import {LotFiltre} from './LotFiltre';
import {Intervention} from '../intervention/Intervention';
import {Prelevement} from '../processus/Prelevement';

export class Filtre implements IFiltre {
    bureau: Bureau;
    id: number;
    idBureau: number;
    idFranchise: number;
    idLotFiltre: number;
    isBlanc: boolean;
    lotFiltre: LotFiltre;
    ref: string;
    idChantier: number;
    idTypeFiltre: number;
    idIntervention: number;
    intervention: Intervention;
    prelevement: Prelevement;
    affectePrelevement: boolean = false;
}
