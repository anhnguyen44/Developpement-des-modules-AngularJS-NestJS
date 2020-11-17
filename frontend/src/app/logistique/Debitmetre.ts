import {IDebitmetre} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';

export class Debitmetre implements IDebitmetre {
    bureau: Bureau;
    id: number;
    idBureau: number;
    idFranchise: number;
    libelle: string;
    ref: string;
}