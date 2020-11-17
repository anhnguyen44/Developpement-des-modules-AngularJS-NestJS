import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { CiviliteModule } from './civilite/civilite.module';
import { HistoriqueModule } from './historique/historique.module';
import { AuthModule } from './auth/auth.module';
import { JWTMiddleware } from './auth/jwt.middleware';
import { ProfilModule } from './profil/profil.module';
import { FranchiseModule } from './franchise/franchise.module';
import { ContactModule } from './contact/contact.module';
import { UtilisateurProfilModule } from './user-profil/utilisateur-profil.module';
import { QualiteModule } from './qualite/qualite.module';
import { BureauModule } from './bureau/bureau.module';
import { DroitModule } from './droit/droit.module';
import { FonctionModule } from './fonction/fonction.module';
import { CompteModule } from './compte/compte.module';
import { ActiviteModule } from './activite/activite.module';
import { CategorieModule } from './categorie/categorie.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { QueryModule } from './query/query.module';
import { ProduitModule } from './produit/produit.module';
import { TypeProduitModule } from './type-produit/type-produit.module';
import { TypeGrilleModule } from './type-grille/type-grille.module';
import { TypeMenuModule } from './type-menu/type-menu.module';
import { DevisCommandeModule } from './devis-commande/devis-commande.module';
import { GrilleTarifModule } from './grille-tarif/grille-tarif.module';
import { TarifDetailModule } from './tarif-detail/tarif-detail.module';
import { FichierModule } from './fichier/fichier.module';
import { MailModule } from './mail/mail.module';
import { GenerationModule } from './generation/generation.module';
import { StatutCommandeModule } from './statut-commande/statut-commande.module';
import { MotifAbandonCommandeModule } from './motif-abandon-commande/motif-abandon-commande.module';
import { BatimentModule } from './batiment/batiment.module';
import { BesoinClientLaboModule } from './besoin-client-labo/besoin-client-labo.module';
import { InfosBesoinClientLaboModule } from './infos-besoin-client-labo/infos-besoin-client-labo.module';
import { ChantierModule } from './chantier/chantier.module';
import { MomentObjectifModule } from './moment-objectif/moment-objectif.module';
import { TypeObjectifModule } from './type-objectif/type-objectif.module';
import { ObjectifModule } from './objectif/objectif.module';
import { TypeBatimentModule } from './type-batiment/type-batiment.module';
import { SitePrelevementModule } from './site-prelevement/site-prelevement.module';
import { TypeContactChantierModule } from './type-contact-chantier/type-contact-chantier.module';
import { ContactChantierModule } from './contact-chantier/contact-chantier.module';
import { SalleModule } from './salle/salle.module';
import { FiltreModule } from './filtre/filtre.module';
import { PompeModule } from './pompe/pompe.module';
import { ConsommableModule } from './consommable/consommable.module';
import { RessourceHumaineModule } from './ressource-humaine/ressource-humaine.module';
import { TypeFacturationModule } from './type-facturation/type-facturation.module';
import { CodePostalModule } from './code-postal/code-postal.module';
import { TypeFichierModule } from './type-fichier/type-fichier.module';
import { TypeContactDevisCommandeModule } from './type-contact-devis-commande/type-contact-devis-commande.module';
import { LotFiltreModule } from './lot-filtre/lot-filtre.module';
import { WebServiceModule } from './web-service/web-service.module';
import { MenuDefiniModule } from './menu-defini/menu-defini.module';
import { ProcessusModule } from './processus/processus.module';
import { MpcaModule } from './mpca/mpca.module';
import { OutilTechniqueModule } from './outil-technique/outil-technique.module';
import { TravailHumideModule } from './travail-humide/travail-humide.module';
import { CaptageAspirationSourceModule } from './captage-aspiration-source/captage-aspiration-source.module';
import { InterventionModule } from './intervention/intervention.module';
import { PrelevementModule } from './prelevement/prelevement.module';
import { TypeFichierGroupeModule } from './type-fichier-goupe/type-fichier-groupe.module';
import { MateriauConstructionAmianteModule } from './materiau-construction-amiante/materiau-construction-amiante.module';
import { ListeModule } from './liste/liste.module';
import { ZoneInterventionModule } from './zone-intervention/zone-intervention.module';
import { StrategieModule } from './strategie/strategie.module';
import { AffectationPrelevementModule } from './affectationPrelevement/affectation-prelevement.module';
import { MateriauZoneModule } from './materiau-zone/materiau-zone.module';
import { HorairesOccupationLocauxModule } from './horaires-occupation/horaires-occupation.module';
import { ProcessusZoneModule } from './processus-zone/processus-zone.module';
import { TacheProcessusModule } from './tache-processus/tache-processus.module';
import { EnvironnementModule } from './environnement/environnement.module';
import { GESModule } from './ges/ges.module';
import { LocalUnitaireModule } from './local-unitaire/local-unitaire.module';
import { EchantillonnageModule } from './echantillonnage/echantillonnage.module';
import { NotificationModule } from './notification/notification.module';

import { CategorieMenuModule } from './categorie-menu/categorie-menu.module';
import { ContenuMenuModule } from './contenu-menu/contenu-menu.module';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { TemplateVersionModule } from './template-version/template-version.module';
import { FormationModule } from './formation/formation.module';
import { TypeFormationModule } from './type-formation/type-formation.module'
import { RhFonctionModule } from './rh-fonction/rh-fonction.module';
import { RhFormationValideModule } from './rh-formationValide/rh-formationValide.module';
import { FormationContactModule } from './formation-contact/formation-contact.module';
import { DomaineCompetenceModule } from './domaine-competence/domaine-competence.module';
import { TFormationDCompetenceModule } from './tFormation-dCompetence/tFormation-dCompetence.module';
import { NoteCompetenceStagiaireModule } from './note-competence-stagiaire/note-competence-stagiaire.module';
import { StationMeteoModule } from './station-meteo/station-meteo.module';
import { RendezVousModule } from './rendez-vous/rendez-vous.module';
import { DebitmetreModule } from './debitmetre/debitmetre.module';
import { FicheExpositionModule} from './fiche-exposition/fiche-exposition.module';
import { FormateurFormationModule } from './formateur-formation/formateur-formation.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql' as 'mysql',
                name: 'default',
                host: configService.getDb().host,
                port: configService.getDb().port,
                username: configService.getDb().dbuser,
                password: configService.getDb().dbpassword,
                database: configService.getDb().dbname,
                entities: [__dirname + '/**/**.entity{.ts,.js}'],
                synchronize: false,
                logging: false,
            }),
            inject: [ConfigService]
        }),
        CiviliteModule,
        UtilisateurModule,
        QualiteModule,
        ProfilModule,
        FranchiseModule,
        UtilisateurProfilModule,
        AuthModule,
        HistoriqueModule,
        QueryModule,
        ContactModule,
        DroitModule,
        BureauModule,
        FonctionModule,
        CompteModule,
        ActiviteModule,
        CategorieModule,
        ProduitModule,
        TypeProduitModule,
        TypeGrilleModule,
        DevisCommandeModule,
        GrilleTarifModule,
        TarifDetailModule,
        FichierModule,
        MailModule,
        GenerationModule,
        StatutCommandeModule,
        MotifAbandonCommandeModule,
        BatimentModule, // Debut chantier
        TypeBatimentModule,
        BesoinClientLaboModule,
        InfosBesoinClientLaboModule,
        ChantierModule,
        MomentObjectifModule,
        TypeObjectifModule,
        ObjectifModule,
        SitePrelevementModule,
        TypeContactChantierModule,
        ContactChantierModule,
        GenerationModule,
        MateriauConstructionAmianteModule,
        ListeModule,
        ZoneInterventionModule,
        StrategieModule,
        MateriauZoneModule,
        HorairesOccupationLocauxModule,
        ProcessusZoneModule,
        EnvironnementModule,
        GESModule,
        LocalUnitaireModule,
        EchantillonnageModule,
        TemplateVersionModule,
        InfosBesoinClientLaboModule, // Fin chantier
        SalleModule,
        FiltreModule,
        PompeModule,
        ConsommableModule,
        RessourceHumaineModule,
        MotifAbandonCommandeModule,
        TypeFacturationModule,
        CodePostalModule,
        TypeFichierModule,
        TypeContactDevisCommandeModule,
        LotFiltreModule,
        TypeContactDevisCommandeModule,
        WebServiceModule,
        TypeMenuModule,
        MenuDefiniModule,
        ProcessusModule, // Debut processus
        MpcaModule,
        OutilTechniqueModule,
        TravailHumideModule,
        CaptageAspirationSourceModule,
        InterventionModule,
        PrelevementModule,
        TypeFichierGroupeModule,
        AffectationPrelevementModule,
        TacheProcessusModule,
        NotificationModule,
        CategorieMenuModule,
        ContenuMenuModule,
        ElasticSearchModule,
        FormationModule,
        TypeFormationModule,
        RhFormationValideModule,
        FormationContactModule,
        DomaineCompetenceModule,
        TFormationDCompetenceModule,
        NoteCompetenceStagiaireModule,
        StationMeteoModule,
        RendezVousModule,
        DebitmetreModule,
        FicheExpositionModule,
        RhFonctionModule,
        FormateurFormationModule
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JWTMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
