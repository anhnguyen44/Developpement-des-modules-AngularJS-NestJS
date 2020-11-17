import {IBureau} from './bureau.model';
import {IUtilisateur} from './utilisateur.model';
import {IRendezVousRessourceHumaine} from './rendez-vous-ressource-humaine.model';
import { Formation, IFormation } from './formation.model';
import { IFonctionRH } from './rh-fonction.model';
import { IFormationValideRH } from './rh-formationValide.model';

export interface IRessourceHumaine {
    id: number;
    idFranchise: number;
    idBureau: number;
    bureau: IBureau;
    idUtilisateur: number;
    utilisateur: IUtilisateur;
    couleur: string;
    rendezVousRessourceHumaines: IRendezVousRessourceHumaine[];
    // formationHabilite: Formation | null;
    fonctions: IFonctionRH[];
    formationValide: IFormationValideRH[];
    
}
