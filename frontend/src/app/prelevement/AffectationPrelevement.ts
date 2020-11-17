import {IAffectationPrelevement} from '@aleaac/shared';
import {Filtre} from '../logistique/Filtre';
import {Contact} from '../contact/Contact';
import {Pompe} from '../logistique/Pompe';
import {Prelevement} from '../processus/Prelevement';
import {Debitmetre} from '../logistique/Debitmetre';

export class AffectationPrelevement implements IAffectationPrelevement{
    filtre: Filtre;
    debitmetre: Debitmetre;
    id: number;
    idFiltre: number;
    idDebitmetre: number;
    idOperateurChantier: number;
    idPompe: number;
    idPrelevement: number;
    operateurChantier: Contact;
    pompe: Pompe;
    prelevement: Prelevement;
    dateHeureDebut: Date | null;
    dateHeureFin: Date | null;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    tachesProcessus: string;
    taches: string[];

    idPosition: number;

    debitFinal1: number;
    debitFinal2: number;
    debitFinal3: number;
    debitInitial1: number;
    debitInitial2: number;
    debitInitial3: number;
    debitMoyenFinal: number;
    debitMoyenInitial: number;

    commentaire: string;

}
