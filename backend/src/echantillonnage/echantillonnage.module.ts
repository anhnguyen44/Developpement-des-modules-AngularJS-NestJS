import { Module } from '@nestjs/common';
import { EchantillonnageController } from './echantillonnage.controller';
import { EchantillonnageService } from './echantillonnage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Echantillonnage } from './echantillonnage.entity';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';
import { Strategie } from '../strategie/strategie.entity';
import { StrategieService } from '../strategie/strategie.service';
import { Objectif } from '../objectif/objectif.entity';
import { ObjectifService } from '../objectif/objectif.service';
import { Chantier } from '../chantier/chantier.entity';
import { ChantierService } from '../chantier/chantier.service';
import { Franchise } from '../franchise/franchise.entity';
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
import { TemplateVersion } from '../template-version/template-version.entity';
import { TemplateVersionService } from '../template-version/template-version.service';
import { Contact } from '../contact/contact.entity';
import { Compte } from '../compte/compte.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { ContactService } from '../contact/contact.service';
import { CompteService } from '../compte/compte.service';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Echantillonnage, ZoneIntervention, Strategie, Objectif, Chantier,
            Franchise, InfosBesoinClientLabo, Mpca, OutilTechnique, TravailHumide, CaptageAspirationSource,
            Prelevement, Fichier, TemplateVersion, Contact, Compte, CompteContact, StatutCommande
        ])
    ],
    controllers: [EchantillonnageController],
    providers: [EchantillonnageService, ZoneInterventionService, StrategieService, ObjectifService,
        ChantierService, FranchiseService, InfosBesoinClientLaboService, MpcaService, OutilTechniqueService,
        TravailHumideService, CaptageAspirationSourceService, PrelevementService, FichierService,
        TemplateVersionService, ContactService, CompteService, StatutCommandeService
    ],
    exports: [EchantillonnageService]
})
export class EchantillonnageModule { }
