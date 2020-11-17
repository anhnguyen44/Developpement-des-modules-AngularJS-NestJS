import {Module} from '@nestjs/common';
import {ProfilController} from './profil.controller';
import {ProfilService} from './profil.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Profil} from './profil.entity';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Adresse } from '../adresse/adresse.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Droit } from '../droit/droit.entity';
import { Franchise } from '../franchise/franchise.entity';
import { QueryService } from '../query/query.service';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profil, CUtilisateur, Adresse, UtilisateurProfil, Droit, Franchise])
    ],
    controllers: [ProfilController],
    providers: [ProfilService, UtilisateurService, QueryService, {
        provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
        useClass: PasswordCryptographerServiceImpl
    }],
    exports: [ProfilService],
})
export class ProfilModule {}
