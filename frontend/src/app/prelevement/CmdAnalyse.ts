import { ICmdAnalyse } from '@aleaac/shared';
import {Chantier} from '../chantier/Chantier';
import {Prelevement} from '../processus/Prelevement';

export class CmdAnalyse implements ICmdAnalyse {
    chantier: Chantier;
    dateEnvoi: Date;
    dateRetour: Date;
    id: number;
    idChantier: number;
    idTypePrelevement: number;
    prelevements: Prelevement[];

}