import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {UtilisateurController} from './utilisateur.controller';
import {UtilisateurService} from './utilisateur.service';
import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import {EmailValidatorModule} from '../validation/email/email-validator.module';
import {PasswordValidatorModule} from '../validation/password/password-validator.module';
import {Civilite} from '../civilite/civilite.entity';
import {CUtilisateur} from './utilisateur.entity';
import { Repository } from 'typeorm';
import { Adresse } from '../adresse/adresse.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Profil } from '../profil/profil.entity';
import { Droit } from '../droit/droit.entity';
import { Qualite } from '../qualite/qualite.entity';
import { Franchise } from '../franchise/franchise.entity';
import { Historique } from '../historique/historique.entity';
import { UtilisateurProfilService } from '../user-profil/utilisateur-profil.service';
import { UtilisateurProfilModule } from '../user-profil/utilisateur-profil.module';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CUtilisateur, Adresse, UtilisateurProfil, Profil, Droit, Civilite, Qualite, Franchise, Historique]),
        PasswordValidatorModule, EmailValidatorModule, LoggerModule, UtilisateurProfilModule, GeocodingModule
    ],
  controllers: [UtilisateurController],
  providers: [
    // ...userProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    UtilisateurService,
    UtilisateurProfilService,
    UtilisateurProfil,
    Repository
  ],
  exports: [UtilisateurService]
})
export class UtilisateurModule {}
