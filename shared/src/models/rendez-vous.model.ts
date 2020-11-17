import {IPompe} from './pompe.model';
import {IRessourceHumaine} from './ressource-humaine.model';
import {IIntervention} from './intervention.model';
import {IRendezVousPompe} from './rendez-vous-pompe.model';
import {IRendezVousRessourceHumaine} from './rendez-vous-ressource-humaine.model';
import {IRendezVousSalle} from './rendez-vous-salle.model';

export interface IRendezVous {
    id: number;
    isDefinitif: boolean;
    dateHeureDebut: Date;
    dateHeureFin: Date;
    rendezVousPompes: IRendezVousPompe[];
    rendezVousRessourceHumaines: IRendezVousRessourceHumaine[];
    rendezVousSalles: IRendezVousSalle[];
    nom: string;
    idParent: number;
    application: string;
    intervention: IIntervention;
    isAbsence: boolean;
}

