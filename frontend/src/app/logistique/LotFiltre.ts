import {IFiltre, ILotFiltre} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';

export class LotFiltre implements ILotFiltre {
    bureau: Bureau;
    dateEnvoi: Date;
    dateReception: Date;
    filtres: IFiltre[];
    fractFiltre: number;
    id: number;
    idBureau: number;
    idFranchise: number;
    isConforme: boolean;
    libelle: string;
    nombreFibresComptees: number;
    nombreGrilleExam: number;
    nombreOuvertureGrillesLues: number;
    numeroPV: string;
    observationFiltre: number;
    ref: string;
    resultat: number;
    surfaceFiltreSecondaire: number;
    surfaceOuvertureGrille: number;
    idTypeFiltre: number;
    stock: number;
    stockTotal: number;
}
