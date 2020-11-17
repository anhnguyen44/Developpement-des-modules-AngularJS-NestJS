import { ICompte, IFranchise, TypeFacturation, IContact } from '@aleaac/shared';
import { Adresse } from '../parametrage/bureau/Adresse';
import { Bureau } from '../parametrage/bureau/Bureau';
import { Franchise } from '../resource/franchise/franchise';
import { Qualite } from '../resource/qualite/Qualite';
import { CompteContact } from './CompteContact';
import { GrilleTarif } from '../resource/grille-tarif/GrilleTarif';
import { Processus } from '../processus/Processus';

export class Compte implements ICompte {
    contacts?: IContact[];
    idTypeFacturation: number;
    processus: Processus[];
    adresse: Adresse;
    bAccreditationCofrac: boolean;
    bEntreprise: boolean;
    bLaboratoire: boolean;
    bureau: Bureau;
    dateValiditeCofrac: Date;
    franchise: IFranchise;
    id: number;
    idAdresse: number;
    idBureau: number;
    idFranchise: number;
    numClientCompta: string;
    raisonSociale: string;
    idQualite: number;
    qualite: Qualite;
    commentaire: string;
    compteContacts: CompteContact[];
    siret: string;
    grilleTarifs: GrilleTarif[];
    typeFacturation: TypeFacturation;
    nbJoursFacturation: number;
}
