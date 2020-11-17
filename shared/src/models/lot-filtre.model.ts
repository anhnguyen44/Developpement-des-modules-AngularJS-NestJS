import {IBureau} from './bureau.model';
import {IFiltre} from './filtre.model';

export interface ILotFiltre {
    id: number;
    ref: string;
    idTypeFiltre: number;
    idBureau: number;
    bureau: IBureau
    idFranchise: number;

    dateEnvoi: Date;
    numeroPV: string;
    dateReception: Date;
    fractFiltre: number;
    surfaceFiltreSecondaire: number;
    surfaceOuvertureGrille: number;
    nombreGrilleExam: number;
    nombreOuvertureGrillesLues: number;
    nombreFibresComptees: number;
    resultat: number;
    observationFiltre: number;
    isConforme: boolean;

    filtres: IFiltre[]
}

export enum EnumTypeFiltre {
    '43-050' = 1,
    '43-269' = 2
}