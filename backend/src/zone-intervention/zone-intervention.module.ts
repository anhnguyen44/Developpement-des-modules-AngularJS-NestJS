import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { LoggerModule } from '../logger/logger.module';
import { ZoneInterventionService } from './zone-intervention.service';
import { ZoneIntervention } from './zone-intervention.entity';
import { ZoneInterventionController } from './zone-intervention.controller';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Adresse } from '../adresse/adresse.entity';
import { Batiment } from '../batiment/batiment.entity';
import { BatimentService } from '../batiment/batiment.service';
import { ProcessusZoneService } from '../processus-zone/processus-zone.service';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { ProcessusModule } from '../processus/processus.module';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { ObjectifService } from '../objectif/objectif.service';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { Objectif } from '../objectif/objectif.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { StrategieService } from '../strategie/strategie.service';
import { Strategie } from '../strategie/strategie.entity';
import { ChantierService } from '../chantier/chantier.service';
import { Chantier } from '../chantier/chantier.entity';
import { Contact } from '../contact/contact.entity';
import { ContactService } from '../contact/contact.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { QueryService } from '../query/query.service';
import { GeocodingService } from '../geocoding/geocoding';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { HistoriqueService } from '../historique/historique.service';
import { Historique } from '../historique/historique.entity';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { PrelevementService } from '../prelevement/prelevement.service';
import { FichierService } from '../fichier/fichier.service';
import { TemplateVersionService } from '../template-version/template-version.service';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { Mpca } from '../mpca/mpca.entity';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { CaptageAspirationSource } from '../captage-aspiration-source/captage-aspiration-source.entity';
import { Prelevement } from '../prelevement/prelevement.entity';
import { Fichier } from '../fichier/fichier.entity';
import { TemplateVersion } from '../template-version/template-version.entity';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { MateriauZoneService } from '../materiau-zone/materiau-zone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZoneIntervention, Adresse, Batiment, ProcessusZone, LocalUnitaire,
      Objectif, Echantillonnage, Strategie, Chantier, Contact, CompteContact, StatutCommande, Historique, InfosBesoinClientLabo, Mpca,
      OutilTechnique, TravailHumide, CaptageAspirationSource, Prelevement, Fichier, TemplateVersion, MateriauZone]),
    LoggerModule, GeocodingModule, ProcessusModule
  ],
  controllers: [
    ZoneInterventionController
  ],
  providers: [
    // ...zoneInterventionProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    ZoneInterventionService,
    BatimentService,
    ProcessusZoneService,
    ObjectifService,
    EchantillonnageService,
    StrategieService,
    ChantierService,
    ContactService,
    StatutCommandeService,
    QueryService,
    GeocodingService,
    HistoriqueService,
    FranchiseService,
    InfosBesoinClientLaboService,
    MpcaService,
    OutilTechniqueService,
    TravailHumideService,
    CaptageAspirationSourceService,
    PrelevementService,
    FichierService,
    TemplateVersionService,
  ],
  exports: [ZoneInterventionService]
})
export class ZoneInterventionModule { }
