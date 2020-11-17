import {IBureau} from './bureau.model';
import {IContact} from './contact.model';
import {IPompe} from './pompe.model';
import {IFiltre} from './filtre.model';
import {IPrelevement} from './prelevement.model';
import {IDebitmetre} from './debit-metre.model';

export interface IAffectationPrelevement {
    id: number;
    idPompe: number;
    pompe: IPompe;
    idFiltre: number;
    filtre: IFiltre;
    idDebitmetre: number;
    debitmetre: IDebitmetre;
    idOperateurChantier: number;
    operateurChantier: IContact;
    idPrelevement: number;
    prelevement: IPrelevement;
    dateHeureDebut: Date | null,
    dateHeureFin: Date | null,

    idPosition: number;

    debitInitial1: number,
    debitInitial2: number,
    debitInitial3: number,
    debitMoyenInitial: number,
    debitFinal1: number,
    debitFinal2: number,
    debitFinal3: number,
    debitMoyenFinal: number,

    commentaire: string
}
