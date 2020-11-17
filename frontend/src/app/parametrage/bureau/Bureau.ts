import {IAdresse, IBureau, IFranchise} from '@aleaac/shared';
import {Adresse} from './Adresse';

export class Bureau implements IBureau {
    nomCommercial: string;
    numeroAccreditation: string;
    dateValiditeAccreditation: Date;
    adresse: Adresse;
    bPrincipal: boolean;
    franchise?: IFranchise;
    id: number;
    idAdresse: number;
    idFranchise?: number;
    nom: string;
    portable: string;
    selected?: boolean;
}
