import { IProcessus } from '@aleaac/shared';
import { Compte } from '../contact/Compte';
import { Prelevement } from './Prelevement';
import { TacheProcessus } from './TacheProcessus';

export class Processus implements IProcessus {
    idAppareilsProtectionRespiratoire: number;
    compte: Compte;
    description: string;
    id: number;
    idCaptageAspirationSource: number;
    idCompte: number;
    idEmpoussierementGeneralAttendu: number;
    idMpca: number;
    idOutilTechnique: number;
    idTravailHumide: number;
    idTypeBatiment: number;
    isProcessusCyclique: boolean;
    libelle: string;
    niveauAttenduFibresAmiante: number;
    nombreOperateurs: number;
    nombreVacationsJour: number;
    prelevements: Prelevement[];
    tachesInstallation: TacheProcessus[];
    tachesRetrait: TacheProcessus[];
    tachesRepli: TacheProcessus[];
    tmin: number;
    tsatA: number;
}
