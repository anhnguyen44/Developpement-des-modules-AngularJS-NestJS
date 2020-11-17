import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { LoggerModule } from '../logger/logger.module';
import { LocalUnitaireService } from './local-unitaire.service';
import { LocalUnitaire } from './local-unitaire.entity';
import { LocalUnitaireController } from './local-unitaire.controller';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { Mpca } from '../mpca/mpca.entity';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { CaptageAspirationSource } from '../captage-aspiration-source/captage-aspiration-source.entity';
import { Prelevement } from '../prelevement/prelevement.entity';
import { Fichier } from '../fichier/fichier.entity';
import { Compte } from '../compte/compte.entity';
import { Strategie } from '../strategie/strategie.entity';
import { Chantier } from '../chantier/chantier.entity';
import { Franchise } from '../franchise/franchise.entity';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { TemplateVersion } from '../template-version/template-version.entity';
import { Historique } from '../historique/historique.entity';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { ContactChantier } from '../contact-chantier/contact-chantier.entity';
import { StrategieService } from '../strategie/strategie.service';
import { ChantierService } from '../chantier/chantier.service';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { PrelevementService } from '../prelevement/prelevement.service';
import { FichierService } from '../fichier/fichier.service';
import { TemplateVersionService } from '../template-version/template-version.service';
import { HistoriqueService } from '../historique/historique.service';
import { ContactChantierService } from '../contact-chantier/contact-chantier.service';
import { ContactService } from '../contact/contact.service';
import { CompteService } from '../compte/compte.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { ObjectifService } from '../objectif/objectif.service';
import { Objectif } from '../objectif/objectif.entity';
import { Contact } from '../contact/contact.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalUnitaire, ZoneIntervention, Echantillonnage, MateriauZone, Strategie,
      Chantier, Franchise, InfosBesoinClientLabo, Mpca, OutilTechnique, TravailHumide, CaptageAspirationSource,
      Prelevement, Fichier, TemplateVersion, Historique, Contact, Compte, CompteContact, StatutCommande, ContactChantier,
      Objectif
    ]), LoggerModule,
  ],
  controllers: [
    LocalUnitaireController
  ],
  providers: [
    // ...localUnitaireProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    LocalUnitaireService,
    ZoneInterventionService,
    EchantillonnageService, ObjectifService,
    StrategieService, ChantierService, FranchiseService, InfosBesoinClientLaboService, MpcaService,
    OutilTechniqueService, CaptageAspirationSourceService, PrelevementService, FichierService,
    TemplateVersionService, HistoriqueService, ContactChantierService, ContactService, CompteService,
    StatutCommandeService
  ],
  exports: [LocalUnitaireService]
})
export class LocalUnitaireModule { }
