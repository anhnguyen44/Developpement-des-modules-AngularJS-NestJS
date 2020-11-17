import { Module } from '@nestjs/common';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from './produit.entity';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { TypeGrilleService } from '../type-grille/type-grille.service';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';

import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Profil } from '../profil/profil.entity';
import { Franchise } from '../franchise/franchise.entity';
import { Droit } from '../droit/droit.entity';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { TypeGrille } from '../type-grille/type-grille.entity';
import { Adresse } from '../adresse/adresse.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Produit, CUtilisateur, Adresse, UtilisateurProfil, Profil, Franchise, Droit, TypeGrille])
    ],
    controllers: [ProduitController],
    providers: [
        {
            provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
            useClass: PasswordCryptographerServiceImpl
        },
        ProduitService, UtilisateurService, TypeGrilleService],
    exports: [ProduitService],
})
export class ProduitModule { }
