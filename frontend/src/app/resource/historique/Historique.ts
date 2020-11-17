import {IHistorique} from '../../../../../shared/index';

export class Historique implements IHistorique {

    id: number;
    idUser: number;
    date: Date;
    application: string;
    idParent: number;
    description: string;

    constructor(idUser: number, date: Date, application: string, idParent: number, description: string) {
        this.idUser = idUser;
        this.date = date;
        this.application = application;
        this.idParent = idParent;
        this.description = description;
    }

}