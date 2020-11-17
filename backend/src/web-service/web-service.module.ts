import {Module} from '@nestjs/common';
import {WebServiceController} from './web-service.controller';
import {WebServiceService} from './web-service.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {Franchise} from '../franchise/franchise.entity';
import {UtilisateurProfil} from '../user-profil/utilisateur-profil.entity';
import {Contact} from '../contact/contact.entity';
import {Adresse} from '../adresse/adresse.entity';
import {ActiviteService} from '../activite/activite.service';
import {FichierService} from '../fichier/fichier.service';
import {Activite} from '../activite/activite.entity';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import {Compte} from '../compte/compte.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CUtilisateur, Franchise, UtilisateurProfil, Contact, CompteContact, Adresse, Activite, Compte])
    ],
    controllers: [WebServiceController],
    providers: [WebServiceService, PasswordCryptographerServiceImpl, ActiviteService],
    exports: [WebServiceService, PasswordCryptographerServiceImpl, ActiviteService]
})
export class WebServiceModule {}
