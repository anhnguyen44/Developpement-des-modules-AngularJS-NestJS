import {ResourceWithoutId, Resource} from './resource.model';
import { IFichier } from './fichier.model';
import { Adresse } from './adresse.model';
import { Objectif } from './objectif.model';
import { TypeObjectif } from './type-objectif.model';

export interface BesoinClientLaboFields {
    dateDemande: any;
    dateDemandeSS4: any;
    // adresseMission: Adresse;
    // idAdresseMission: number;
    typeBesoinLabo: TypeObjectif;
    idTypeBesoinLabo: number;
    ss3: boolean;
    ss4: boolean;
    documents: IFichier[]; // PDRE, Liste processus, Mode Op, PIC, Planning des infos, Repérage amiante, Photos, Plans, PDRE de l'entreprise de travaux
    objectifs: Objectif[];
    descriptifChantier: string;
    effectifPrevu: string;
    commentaires: string;

    perimetreGlobal: string;
}

export enum EnumTypeBesoinLabo {
    CODE_TRAVAIL = 1,
    CODE_SANTE_PUBLIQUE = 2
}

export interface IBesoinClientLabo extends BesoinClientLaboFields, ResourceWithoutId {}
export class BesoinClientLabo implements BesoinClientLaboFields, Resource {
    dateDemande: any;
    dateDemandeSS4: any;
    // adresseMission: Adresse;
    // idAdresseMission: number;
    typeBesoinLabo: TypeObjectif;
    ss3: boolean;
    ss4: boolean;
    documents: IFichier[];
    objectifs: Objectif[];
    descriptifChantier: string;
    effectifPrevu: string;
    commentaires: string;
    id: number;
    idTypeBesoinLabo: number;

    perimetreGlobal: string;
}

