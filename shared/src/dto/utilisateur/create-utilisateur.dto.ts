import {IsString, IsInt} from 'class-validator';
import {IUtilisateur} from '../../models/utilisateur.model';

export class CreateUtilisateurDto {
  // TODO: how can i validate this?
  readonly user: IUtilisateur;
}
