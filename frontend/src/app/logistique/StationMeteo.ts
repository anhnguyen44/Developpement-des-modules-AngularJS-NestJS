import {IStationMeteo} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';


export class StationMeteo implements IStationMeteo {
    bureau: Bureau;
    id: number;
    idBureau: number;
    idFranchise: number;
    libelle: string;
    ref: string;
}
