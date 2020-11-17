import {ResourceWithoutId} from './resource.model';
import { IUtilisateur } from './utilisateur.model';
import { IFranchise } from './franchise.model';
import { IProfil } from './profil.model';

export class CUtilisateurProfil {
    utilisateur: IUtilisateur;
    idUtilisateur?: number;
    profil: IProfil;
    idProfil?: number;
    franchise: IFranchise;
    idFranchise?: number;
}
