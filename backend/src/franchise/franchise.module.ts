import { Module } from '@nestjs/common';
import { FranchiseController } from './franchise.controller';
import { FranchiseService } from './franchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchise } from './franchise.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Profil } from '../profil/profil.entity';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Droit } from '../droit/droit.entity';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { Repository } from 'typeorm';
import { Adresse } from '../adresse/adresse.entity';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { Produit } from '../produit/produit.entity';
import { TypeGrille } from '../type-grille/type-grille.entity';
import { GrilleTarifService } from '../grille-tarif/grille-tarif.service';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Franchise, UtilisateurProfil, Profil, CUtilisateur, Adresse,
             Droit, GrilleTarif, Produit, TypeGrille, TarifDetail])
    ],
    controllers: [FranchiseController],
    providers: [FranchiseService,
        UtilisateurService,
        GrilleTarifService,
        {
            provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
            useClass: PasswordCryptographerServiceImpl
        }
        , Repository
    ],
    exports: [FranchiseService],
})
export class FranchiseModule { }
