import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { BesoinClientLaboController } from './besoin-client-labo.controller';
import { BesoinClientLaboService } from './besoin-client-labo.service';
import {BesoinClientLabo} from './besoin-client-labo.entity';
import { StrategieService } from '../strategie/strategie.service';
import { Strategie } from '../strategie/strategie.entity';
import { MomentObjectifService } from '../moment-objectif/moment-objectif.service';
import { MomentObjectif } from '../moment-objectif/moment-objectif.entity';
import { TypeObjectifService } from '../type-objectif/type-objectif.service';
import { HistoriqueService } from '../historique/historique.service';
import { TypeObjectif } from '../type-objectif/type-objectif.entity';
import { Historique } from '../historique/historique.entity';
import { Franchise } from '../franchise/franchise.entity';
import { FranchiseService } from '../franchise/franchise.service';
import { Chantier } from '../chantier/chantier.entity';
import { ChantierService } from '../chantier/chantier.service';
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
import { TemplateVersion } from '../template-version/template-version.entity';
import { TemplateVersionService } from '../template-version/template-version.service';
import { Contact } from '../contact/contact.entity';
import { ContactService } from '../contact/contact.service';
import { Adresse } from '../adresse/adresse.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([BesoinClientLabo, Strategie, MomentObjectif, TypeObjectif, Historique, Chantier,
        Franchise, InfosBesoinClientLabo, Mpca, OutilTechnique, TravailHumide, CaptageAspirationSource,
        Prelevement, Fichier, TemplateVersion, Contact, Adresse, CompteContact, StatutCommande,
      ]), LoggerModule
  ],
    controllers: [
        BesoinClientLaboController
    ],
  providers: [
    // ...besoinClientLaboProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    BesoinClientLaboService,
    StrategieService,
    MomentObjectifService,
    TypeObjectifService,
    HistoriqueService,
    ChantierService,
    FranchiseService,
    InfosBesoinClientLaboService,
    MpcaService,
    OutilTechniqueService,
    TravailHumideService,
    CaptageAspirationSourceService,
    PrelevementService,
    FichierService,
    TemplateVersionService,
    ContactService,
    StatutCommandeService,
  ],
  exports: [BesoinClientLaboService]
})
export class BesoinClientLaboModule {}
