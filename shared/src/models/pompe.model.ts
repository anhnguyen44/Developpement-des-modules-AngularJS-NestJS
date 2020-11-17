import {IBureau} from './bureau.model';
import {IRendezVousPompe} from './rendez-vous-pompe.model';

export interface IPompe {
    id: number;
    ref: string;
    libelle: string;
    idFranchise: number;
    idBureau: number;
    bureau: IBureau
    idTypePompe: EnumTypePompe;
    rendezVousPompes: IRendezVousPompe[];
    indiceVolumique: number;
    incertitude: number;
    dateEtalonnage: Date;
    dateValidation: Date;
    dateVerifAnnexe: Date
    periodeEtalonnage: number;
    periodeValidation: number;
    periodeVerifAnnexe: number;
    couleur: string;
}

export enum EnumTypePompe {
    ENVIRONNEMENTALE = 1,
    INDIVIDUELLE = 2
}
