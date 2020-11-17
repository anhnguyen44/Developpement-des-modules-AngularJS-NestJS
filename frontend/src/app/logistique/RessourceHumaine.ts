import {IRessourceHumaine, IUtilisateur, IFormation, IFonctionRH, IFormationValideRH, Formation} from '@aleaac/shared';
import {Bureau} from '../parametrage/bureau/Bureau';
import {RendezVous} from './RendezVous';
import {RendezVousPompe} from './RendezVousPompe';
import {RendezVousRessourceHumaine} from './RendezVousRessourceHumaine';

export class RessourceHumaine implements IRessourceHumaine{
    bureau: Bureau;
    id: number;
    idBureau: number;
    idFranchise: number;
    idUtilisateur: number;
    utilisateur: IUtilisateur;
    rendezVous: RendezVous[];
    couleur: string;
    checked: boolean;
    rendezVousRessourceHumaines: RendezVousRessourceHumaine[];
    // formationHabilite: Formation | null;
    fonctions: IFonctionRH[];
    formationValide: IFormationValideRH[];
}
