import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChantierRoutingModule } from './chantier-routing.module';
import { ListeChantierComponent } from './liste-chantier/liste-chantier.component';
import { ResourceModule } from '../resource/resource.module';
import { InformationChantierComponent } from './information-chantier/information-chantier.component';
import { MenuChantierComponent } from './menu-chantier/menu-chantier.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { ContactModule } from '../contact/contact.module';
import { ModalClientChantierComponent } from './modal-client/modal-client.component';
import { ModalUserChantierComponent } from './modal-user/modal-user.component';
import { ListeUtilisateurChantierComponent } from './liste-user/utilisateur-liste.component';
import { PageListeContactChantierComponent } from './page-liste-contact/page-liste-contact.component';
import { SiteInterventionComponent } from './sites-intervention/sites-intervention.component';
import { BesoinClientComponent } from './besoin-client/besoin-client.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ModalSiteInterventionComponent } from './modal-site-intervention/modal-site-intervention.component';
import { HistoriqueChantierComponent } from './historique-chantier/historique-chantier.component';
import { FichierChantierComponent } from './fichier-chantier/fichier-chantier.component';
import { ListeSitePrelevementComponent } from './sites-intervention/liste/liste-sites-intervention.component';
import { SiteInterventionEditComponent } from './sites-intervention/edit/site-intervention.component';
import { ModalAbandonChantierComponent } from './modal-abandon/modal-abandon.component';
import { ModalInformationsBesoinComponent } from './informations-besoin/modal-informations-besoin/modal-informations-besoin.component';
import { InformationsBesoinComponent } from './informations-besoin/informations-besoin.component';
import { DevisChantierComponent } from './devis/devis.component';
import { DevisCommandeModule } from '../devis-commande/devis-commande.module';
import { ModalDevisCommandeChantierComponent } from './modal-devis-commande/modal-devis-commande.component';
import { StrategieComponent } from './strategie/strategie.component';
import { ListeZoneInterventionComponent } from './zone-intervention/liste/liste-zone-intervention.component';
import { ModalStrategieComponent } from './modal-strategie/modal-strategie.component';
import { ZoneInterventionComponent } from './zone-intervention/edit/zone-intervention.component';
import { ModalMateriauZoneComponent } from './modal-materiau/modal-materiau.component';
import { SelecteurMateriauZoneComponent } from './selecteur-materiau/selecteur-materiau.component';
import { PageInterventionComponent } from './page-intervention/page-intervention.component';
import { InterventionModule } from '../intervention/intervention.module';
import { ListeMateriauZoneComponent } from './materiau-amiante/liste/liste-materiau-amiante.component';
import { ModalHorairesZoneComponent } from './modal-horaires/modal-horaires.component';
import { ListeProcessusZoneComponent } from './processus-zone/liste-processus-zone.component';
import { GesProcessusZoneComponent } from './processus-zone/ges/ges.component';
import { ModalProcessusZoneComponent } from './modal-processus-zone/modal-processus-zone.component';
import { ModalProcessusComponent } from './modal-processus/modal-processus.component';
import { ProcessusModule } from '../processus/processus.module';
import { EchantillonnageComponent } from './echantillonnage/echantillonnage.component';
import { EchantillonnageService } from '../resource/echantillonnage/echantillonnage.service';
import { PagePrelevementComponent } from './page-prelevement/page-prelevement.component';
import { ZoneInterventionDefinitionComponent } from './zone-intervention/definition/zone-definition.component';
import { PagePrelevementZoneComponent } from './zone-intervention/page-prelevement/page-prelevement-zone.component';
import { ZoneInterventionPrelevementComponent } from './zone-intervention/prelevement/zone-prelevement.component';
import { PrelevementModule } from '../prelevement/prelevement.module';
import { HistoriqueStrategieComponent } from './historique-strategie/historique-strategie.component';
import { FichierStrategieComponent } from './fichier-strategie/fichier-strategie.component';
import { ModalImportZoneComponent } from './zone-intervention/modal-import-zone/modal-import-zone.component';
import { FichierZoneComponent } from './fichier-zone/fichier-zone.component';
import { DebounceClickDirective } from './debounce/debounce-directive';

@NgModule({
  declarations: [
    ListeChantierComponent,
    InformationChantierComponent,
    MenuChantierComponent,
    ModalClientChantierComponent,
    ModalUserChantierComponent,
    ListeUtilisateurChantierComponent,
    PageListeContactChantierComponent,
    SiteInterventionComponent,
    BesoinClientComponent,
    ModalSiteInterventionComponent,
    HistoriqueChantierComponent,
    FichierChantierComponent,
    ListeSitePrelevementComponent,
    SiteInterventionComponent,
    SiteInterventionEditComponent,
    ModalAbandonChantierComponent,
    ModalInformationsBesoinComponent,
    InformationsBesoinComponent,
    DevisChantierComponent,
    ModalDevisCommandeChantierComponent,
    StrategieComponent,
    ListeZoneInterventionComponent,
    ModalStrategieComponent,
    ZoneInterventionComponent,
    ModalMateriauZoneComponent,
    SelecteurMateriauZoneComponent,
    PageInterventionComponent,
    ListeMateriauZoneComponent,
    ModalHorairesZoneComponent,
    ListeProcessusZoneComponent,
    GesProcessusZoneComponent,
    ModalProcessusZoneComponent,
    ModalProcessusComponent,
    EchantillonnageComponent,
    PagePrelevementComponent,
    ZoneInterventionDefinitionComponent,
    PagePrelevementZoneComponent,
    ZoneInterventionPrelevementComponent,
    HistoriqueStrategieComponent,
    FichierStrategieComponent,
    ModalImportZoneComponent,
    FichierZoneComponent,
    DebounceClickDirective,
  ],
  imports: [
    CommonModule,
    ChantierRoutingModule,
    ResourceModule,
    ClickOutsideModule,
    ContactModule,
    TooltipModule,
    DevisCommandeModule,
    InterventionModule,
    ProcessusModule,
    PrelevementModule,
  ]
})
export class ChantierModule { }
