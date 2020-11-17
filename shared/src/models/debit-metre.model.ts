import {IBureau} from './bureau.model';

export interface IDebitmetre {
    id: number;
    ref: string;
    libelle: string;
    idFranchise: number;
    idBureau: number;
    bureau: IBureau;
}
