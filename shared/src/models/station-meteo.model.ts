import {IBureau} from './bureau.model';

export interface IStationMeteo {
    id: number;
    ref: string;
    libelle: string;
    idFranchise: number;
    idBureau: number;
    bureau: IBureau
}