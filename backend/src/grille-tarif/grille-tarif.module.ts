import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from '../produit/produit.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';
import { TypeGrille } from '../type-grille/type-grille.entity';
import { GrilleTarifController } from './grille-tarif.controller';
import { GrilleTarif } from './grille-tarif.entity';
import { GrilleTarifService } from './grille-tarif.service';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';

import { Droit } from '../droit/droit.entity';
import { Adresse } from '../adresse/adresse.entity';
import { Profil } from '../profil/profil.entity';
import { Franchise } from '../franchise/franchise.entity';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { TypeGrilleService } from '../type-grille/type-grille.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { ProduitService } from '../produit/produit.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([GrilleTarif, Produit, TarifDetail, TypeGrille, CUtilisateur,
             Adresse, UtilisateurProfil, Profil, Franchise, Droit])
    ],
    controllers: [GrilleTarifController],
    providers: [
        {
            provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
            useClass: PasswordCryptographerServiceImpl
        },
        GrilleTarifService,
        ProduitService, UtilisateurService, TypeGrilleService
    ],
    exports: [GrilleTarifService],
})
export class GrilleTarifModule {}
