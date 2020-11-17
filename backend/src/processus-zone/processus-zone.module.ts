import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessusZone } from './processus-zone.entity';
import { ProcessusZoneController } from './processus-zone.controller';
import { ProcessusZoneService } from './processus-zone.service';
import { Objectif } from '../objectif/objectif.entity';
import { ObjectifService } from '../objectif/objectif.service';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { Strategie } from '../strategie/strategie.entity';
import { StrategieService } from '../strategie/strategie.service';
import { Chantier } from '../chantier/chantier.entity';
import { Franchise } from '../franchise/franchise.entity';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { Mpca } from '../mpca/mpca.entity';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { CaptageAspirationSource } from '../captage-aspiration-source/captage-aspiration-source.entity';
import { Prelevement } from '../prelevement/prelevement.entity';
import { Fichier } from '../fichier/fichier.entity';
import { TemplateVersion } from '../template-version/template-version.entity';
import { Historique } from '../historique/historique.entity';
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
import { Contact } from '../contact/contact.entity';
import { Compte } from '../compte/compte.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { ContactChantierService } from '../contact-chantier/contact-chantier.service';
import { ContactService } from '../contact/contact.service';
import { CompteService } from '../compte/compte.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { ContactChantier } from '../contact-chantier/contact-chantier.entity';



@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessusZone, Objectif, Echantillonnage, ZoneIntervention, LocalUnitaire, MateriauZone, Strategie,
        Chantier, Franchise, InfosBesoinClientLabo, Mpca, OutilTechnique, TravailHumide, CaptageAspirationSource,
        Prelevement, Fichier, TemplateVersion, Historique, Contact, Compte, CompteContact, StatutCommande, ContactChantier
        ])
    ],
    controllers: [ProcessusZoneController],
    providers: [ProcessusZoneService, ObjectifService, EchantillonnageService, ZoneInterventionService,
                StrategieService, ChantierService, FranchiseService, InfosBesoinClientLaboService, MpcaService,
                OutilTechniqueService, CaptageAspirationSourceService, PrelevementService, FichierService,
                TemplateVersionService, HistoriqueService, ContactChantierService, ContactService, CompteService,
                StatutCommandeService
            ],
    exports: [ProcessusZoneService]
})
export class ProcessusZoneModule { }
