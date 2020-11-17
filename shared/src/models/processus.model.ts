import { ICompte } from './compte.model';
import { IPrelevement } from './prelevement.model';
import { ITacheProcessus } from './tache-processus.model';

export interface IProcessus {
    id: number,
    idCompte: number,
    compte: ICompte,
    libelle: string,
    idTypeBatiment: number,
    idMpca: number,
    idOutilTechnique: number,
    idTravailHumide: number,
    idCaptageAspirationSource: number,
    isProcessusCyclique: boolean,
    description: string,
    tachesInstallation: ITacheProcessus[],
    tachesRetrait: ITacheProcessus[],
    tachesRepli: ITacheProcessus[],
    niveauAttenduFibresAmiante: number,

    prelevements: IPrelevement[]
    tmin: number,
    tsatA: number
}

export class Processus implements IProcessus {
    id: number;
    idCompte: number;
    compte: ICompte;
    libelle: string;
    idTypeBatiment: number;
    idMpca: number;
    idOutilTechnique: number;
    idTravailHumide: number;
    idCaptageAspirationSource: number;
    isProcessusCyclique: boolean;
    description: string;
    tachesInstallation: ITacheProcessus[];
    tachesRetrait: ITacheProcessus[];
    tachesRepli: ITacheProcessus[];
    niveauAttenduFibresAmiante: number;
    prelevements: IPrelevement[];
    tmin: number;
    tsatA: number;
}

export enum EnumEmpoussierementGeneral {
    FAIBLE = 1,
    MOYEN = 2,
    FORT = 3,
    INCONNU = 4
}

export enum EnumAppareilsProtectionRespiratoire {
    AUCUN = 1,
    VA = 2,
    AA = 3
}
