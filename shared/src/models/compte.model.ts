import { IAdresse } from './adresse.model';
import { IBureau } from './bureau.model';
import { IFranchise } from './franchise.model';
import { Qualite } from './qualite.model';
import { IContact } from './contact.model';
import { IGrilleTarif } from './grille-tarif.model';
import { TypeFacturation } from './type-facturation.model';
import { Processus } from './processus.model';

export interface ICompte {
    id: number;
    raisonSociale: string;
    siret: string;
    idBureau: number;
    idQualite: number;
    qualite: Qualite;
    bureau: IBureau;
    idFranchise: number;
    franchise: IFranchise;
    idAdresse: number;
    adresse: IAdresse;
    numClientCompta: string;
    bLaboratoire: boolean;
    bAccreditationCofrac: boolean;
    dateValiditeCofrac: Date;
    bEntreprise: boolean;
    commentaire: string;
    contacts?: IContact[];
    grilleTarifs: IGrilleTarif[]
    typeFacturation: TypeFacturation;
    idTypeFacturation: number;
    nbJoursFacturation: number;
    compteContacts: any;
    processus: Processus[];
}
