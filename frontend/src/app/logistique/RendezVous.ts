import { IRendezVous } from '@aleaac/shared';
import { Pompe } from './Pompe';
import { RessourceHumaine } from './RessourceHumaine';
import { Intervention } from '../intervention/Intervention';
import { RendezVousPompe } from './RendezVousPompe';
import { RendezVousSalle } from './RendezVousSalle';
import { RendezVousRessourceHumaine } from './RendezVousRessourceHumaine';

export class RendezVous implements IRendezVous {
    dateHeureDebut: Date;
    dateDebut: string;
    heureDebut: string;

    dateHeureFin: Date;
    dateFin: string;
    heureFin: string;

    id: number;
    isDefinitif: boolean;
    ressourceHumaines: RessourceHumaine[];
    application: string;
    idParent: number;
    nom: string;
    intervention: Intervention;
    isAbsence: boolean;
    motifAbsence: string;
    rendezVousPompes: RendezVousPompe[];
    rendezVousSalles: RendezVousSalle[];
    rendezVousRessourceHumaines: RendezVousRessourceHumaine[];
}
