import {Module} from '@nestjs/common';
import {UtilisateurProfilController} from './utilisateur-profil.controller';
import {UtilisateurProfilService} from './utilisateur-profil.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UtilisateurProfil} from './utilisateur-profil.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UtilisateurProfil])
    ],
    controllers: [UtilisateurProfilController],
    providers: [UtilisateurProfilService],
    exports: [UtilisateurProfilService],
})
export class UtilisateurProfilModule {}
