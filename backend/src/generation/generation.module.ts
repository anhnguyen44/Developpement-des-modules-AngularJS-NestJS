import {Global, Module} from '@nestjs/common';
import {GenerationService} from './generation.service';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Droit } from '../droit/droit.entity';
import { Franchise } from '../franchise/franchise.entity';
import { Profil } from '../profil/profil.entity';
import { Adresse } from '../adresse/adresse.entity';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { Produit } from '../produit/produit.entity';
import { TypeGrille } from '../type-grille/type-grille.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';
import { GrilleTarifService } from '../grille-tarif/grille-tarif.service';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { Repository } from 'typeorm';
import { TemplateVersionService } from '../template-version/template-version.service';
import { TemplateVersion } from '../template-version/template-version.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Franchise, UtilisateurProfil, Profil, CUtilisateur, Adresse,
        Droit, GrilleTarif, Produit, TypeGrille, TarifDetail, TemplateVersion])],
    controllers: [ImportController],
    providers: [GenerationService, ImportService, UtilisateurService, GrilleTarifService, TemplateVersionService,
        {
            provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
            useClass: PasswordCryptographerServiceImpl
        }
        , Repository],
    exports: [GenerationService, ImportService]
})
export class GenerationModule {}
