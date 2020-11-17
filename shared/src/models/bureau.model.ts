import {IAdresse} from './adresse.model';
import {IFranchise} from './franchise.model';

export interface IBureau {

    id: number,
    bPrincipal: boolean,
    nom: string,
    idFranchise?: number,
    franchise?: IFranchise,
    idAdresse: number,
    adresse: IAdresse,
    portable: string,
    numeroAccreditation: string,
    dateValiditeAccreditation: Date,
    nomCommercial: string
}
