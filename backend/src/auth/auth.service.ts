import { Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { AppProperties } from '../config/app-properties.model';
import { CONFIG_TOKEN } from '../config/constants';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { delay } from 'rxjs/operators';


@Injectable()
export class AuthService {
  private static readonly DEFAULT_SIGN_OPTIONS: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '7d'
  };

  private readonly signOptions: SignOptions;
  private readonly secret: string;

  constructor(@Inject(CONFIG_TOKEN) config: AppProperties,
              @InjectRepository(CUtilisateur)
              private utilisateurRepository: Repository<CUtilisateur>) {
    this.secret = config.token.secret;
    this.signOptions = {
      algorithm: config.token.algorithm || AuthService.DEFAULT_SIGN_OPTIONS.algorithm,
      expiresIn: config.token.expiresIn || AuthService.DEFAULT_SIGN_OPTIONS.expiresIn,
    };
  }

  createToken(payload: object): string {
    return sign(payload, this.secret, this.signOptions);
  }

  async validateUtilisateur(signedUtilisateur: CUtilisateur): Promise<boolean> {
    if (!signedUtilisateur || (signedUtilisateur && signedUtilisateur ! instanceof CUtilisateur)
    || (signedUtilisateur && !signedUtilisateur.id)) {
      return false;
    }
    // put some validation logic here
    // for example token blacklist or query db by id/email
    try {
      const user = await this.utilisateurRepository.findOneOrFail({ id: signedUtilisateur.id});
      return !user.isSuspendu;
    } catch (err) {
      console.warn(err);
      return true;
    }
  }
}
