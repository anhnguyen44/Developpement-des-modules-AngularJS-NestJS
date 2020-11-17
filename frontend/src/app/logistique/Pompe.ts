import {EnumTypePompe, IPompe} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';
import {RendezVous} from './RendezVous';
import {RendezVousPompe} from './RendezVousPompe';

export class Pompe implements IPompe {
    dateEtalonnage: Date;
    periodeEtalonnage: number;
    dateValidation: Date;
    periodeValidation: number;
    dateVerifAnnexe: Date;
    periodeVerifAnnexe: number;
    id: number;
    incertitude: number;
    indiceVolumique: number;
    libelle: string;
    ref: string;
    idTypePompe: EnumTypePompe;
    bureau: Bureau;
    idBureau: number;
    idFranchise: number;
    rendezVous: RendezVous[];
    couleur: string;
    checked: boolean;
    rendezVousPompes: RendezVousPompe[];
    affecteInter: boolean;
}
