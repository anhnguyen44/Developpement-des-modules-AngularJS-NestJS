import { Module } from '@nestjs/common';
import { DevisCommandeController } from './devis-commande.controller';
import { DevisCommandeService } from './devis-commande.service';
import { DevisCommande } from './devis-commande.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchise } from '../franchise/franchise.entity';
import { DevisCommandeDetail } from '../devis-commande-detail/devis-commande-detail.entity';
import { ContactService } from '../contact/contact.service';
import { ContactModule } from '../contact/contact.module';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Adresse } from '../adresse/adresse.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Profil } from '../profil/profil.entity';
import { Droit } from '../droit/droit.entity';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { ContactDevisCommande } from '../contact-devis-commande/contact-devis-commande.entity';
import { TypeContactDevisCommande } from '../type-contact-devis-commande/type-contact-devis-commande.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { ChantierService } from '../chantier/chantier.service';
import { BesoinClientLaboService } from '../besoin-client-labo/besoin-client-labo.service';
import { StrategieService } from '../strategie/strategie.service';
import { InterventionService } from '../intervention/intervention.service';
import { ProduitService } from '../produit/produit.service';
import { GrilleTarifService } from '../grille-tarif/grille-tarif.service';
import { Historique } from '../historique/historique.entity';
import { Chantier } from '../chantier/chantier.entity';
import { Contact } from '../contact/contact.entity';
import { Compte } from '../compte/compte.entity';
import { BesoinClientLabo } from '../besoin-client-labo/besoin-client-labo.entity';
import { Strategie } from '../strategie/strategie.entity';
import { Intervention } from '../intervention/intervention.entity';
import { Produit } from '../produit/produit.entity';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';
import { TarifDetailService } from '../tarif-detail/tarif-detail.service';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { FranchiseService } from '../franchise/franchise.service';
import { Mpca } from '../mpca/mpca.entity';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechnique } from '../outil-technique/outil-technique.entity';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { CaptageAspirationSource } from '../captage-aspiration-source/captage-aspiration-source.entity';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { TravailHumide } from '../travail-humide/travail-humide.entity';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { Fichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { TemplateVersion } from '../template-version/template-version.entity';
import { TemplateVersionService } from '../template-version/template-version.service';
import { Objectif } from '../objectif/objectif.entity';
import { ObjectifService } from '../objectif/objectif.service';


@Module({
    imports: [
        ContactModule,
        TypeOrmModule.forFeature([
            DevisCommande,
            Franchise,
            DevisCommandeDetail,
            StatutCommande,
            CUtilisateur,
            Adresse,
            UtilisateurProfil,
            Profil,
            Franchise,
            Droit,
            ContactDevisCommande,
            TypeContactDevisCommande,
            Chantier,
            Historique,
            Contact,
            Compte,
            BesoinClientLabo,
            Strategie,
            Intervention,
            Produit,
            GrilleTarif,
            TarifDetail,
            ZoneIntervention,
            LocalUnitaire,
            Echantillonnage,
            Mpca,
            OutilTechnique,
            CaptageAspirationSource,
            TravailHumide,
            Fichier,
            InfosBesoinClientLabo,
            TemplateVersion,
            Objectif,
        ]),
        GeocodingModule
    ],
    controllers: [DevisCommandeController],
    providers: [
        {
            provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
            useClass: PasswordCryptographerServiceImpl
        },
        DevisCommandeService, ContactService, StatutCommandeService, UtilisateurService,
        ChantierService, BesoinClientLaboService, StrategieService, InterventionService,
        ProduitService, GrilleTarifService, TarifDetailService, ZoneInterventionService,
        EchantillonnageService, FranchiseService, MpcaService, OutilTechniqueService,
        CaptageAspirationSourceService, TravailHumideService, FichierService, InfosBesoinClientLaboService,
        TemplateVersionService, ObjectifService,
    ],
    exports: [DevisCommandeService]
})
export class DevisCommandeModule { }