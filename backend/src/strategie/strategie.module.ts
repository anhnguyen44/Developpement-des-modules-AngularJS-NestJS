import { Module } from '@nestjs/common';
import { StrategieController } from './strategie.controller';
import { StrategieService } from './strategie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Strategie } from './strategie.entity';
import { Franchise } from '../franchise/franchise.entity';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { Mpca } from '../mpca/mpca.entity';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { Prelevement } from '../prelevement/prelevement.entity';
import { PrelevementService } from '../prelevement/prelevement.service';
import { Objectif } from '../objectif/objectif.entity';
import { Fichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';
import { TemplateVersion } from '../template-version/template-version.entity';
import { TemplateVersionService } from '../template-version/template-version.service';
import { GenerationService } from '../generation/generation.service';
import { Chantier } from '../chantier/chantier.entity';
import { ChantierService } from '../chantier/chantier.service';
import { Contact } from '../contact/contact.entity';
import { ContactService } from '../contact/contact.service';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { CompteService } from '../compte/compte.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Strategie, Franchise, InfosBesoinClientLabo, ProcessusZone, ZoneIntervention,
            Mpca, OutilTechnique, TravailHumide, SitePrelevement, Prelevement, Objectif, Fichier, TemplateVersion,
            Chantier, Contact, StatutCommande, CompteContact
        ])
    ],
    controllers: [StrategieController],
    providers: [StrategieService, FranchiseService, InfosBesoinClientLaboService, MpcaService, OutilTechniqueService,
        TravailHumideService, PrelevementService, FichierService, TemplateVersionService, GenerationService, ChantierService,
        ContactService, StatutCommandeService
    ],
    exports: [StrategieService]
})
export class StrategieModule { }
