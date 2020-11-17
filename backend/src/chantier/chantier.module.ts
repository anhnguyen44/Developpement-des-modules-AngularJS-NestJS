import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { ChantierController } from './chantier.controller';
import { ChantierService } from './chantier.service';
import {Chantier} from './chantier.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Droit } from '../droit/droit.entity';
import { Franchise } from '../franchise/franchise.entity';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { Adresse } from '../adresse/adresse.entity';
import { Profil } from '../profil/profil.entity';
import { Contact } from '../contact/contact.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { ContactService } from '../contact/contact.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { QueryService } from '../query/query.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { ContactChantierService } from '../contact-chantier/contact-chantier.service';
import { ContactChantier } from '../contact-chantier/contact-chantier.entity';
import { DevisCommandeService } from '../devis-commande/devis-commande.service';
import { DevisCommande } from '../devis-commande/devis-commande.entity';
import { DevisCommandeDetail } from '../devis-commande-detail/devis-commande-detail.entity';
import { ContactDevisCommande } from '../contact-devis-commande/contact-devis-commande.entity';
import { TypeContactDevisCommande } from '../type-contact-devis-commande/type-contact-devis-commande.entity';
import { NotificationService } from '../notification/notification.service';
import { MailService } from '../mail/mail.service';
import { StrategieService } from '../strategie/strategie.service';
import { Notification } from '../notification/notification.entity';
import { NotificationVuPar } from '../notification-vu-par/notification-vu-par.entity';
import { CryptoService } from '../crypto/crypto';
import { Strategie } from '../strategie/strategie.entity';
import { TypeContactChantierService } from '../type-contact-chantier/type-contact-chantier.service';
import { TypeContactChantier } from '../type-contact-chantier/type-contact-chantier.entity';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { Mpca } from '../mpca/mpca.entity';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { CaptageAspirationSource } from '../captage-aspiration-source/captage-aspiration-source.entity';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { Prelevement } from '../prelevement/prelevement.entity';
import { PrelevementService } from '../prelevement/prelevement.service';
import { Fichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';
import { TemplateVersionService } from '../template-version/template-version.service';
import { TemplateVersion } from '../template-version/template-version.entity';
import { Historique } from '../historique/historique.entity';
import { HistoriqueService } from '../historique/historique.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Chantier, Franchise, StatutCommande, CUtilisateur,
        Adresse, UtilisateurProfil, Profil, Droit, Contact, CompteContact, ContactChantier,
        DevisCommande, DevisCommandeDetail, ContactDevisCommande, TypeContactDevisCommande,
        Notification, NotificationVuPar, Strategie, TypeContactChantier, InfosBesoinClientLabo, Mpca,
        OutilTechnique, TravailHumide, CaptageAspirationSource, Prelevement, Fichier, TemplateVersion,
        Historique, Fichier
      ]), LoggerModule
  ],
    controllers: [
        ChantierController
    ],
  providers: [
    // ...chantierProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    ChantierService,
    ContactService,
    StatutCommandeService,
    QueryService,
    UtilisateurService,
    ContactChantierService,
    DevisCommandeService,
    NotificationService,
    MailService,
    StrategieService,
    CryptoService,
    TypeContactChantierService,
    FranchiseService,
    InfosBesoinClientLaboService,
    MpcaService,
    OutilTechniqueService,
    TravailHumideService,
    CaptageAspirationSourceService,
    PrelevementService,
    FichierService,
    TemplateVersionService,
    HistoriqueService,
    FichierService,
  ],
  exports: [ChantierService]
})
export class ChantierModule {}
