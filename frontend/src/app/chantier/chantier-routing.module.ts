import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeChantierComponent } from './liste-chantier/liste-chantier.component';
import { InformationChantierComponent } from './information-chantier/information-chantier.component';
import { SiteInterventionComponent } from './sites-intervention/sites-intervention.component';
import { BesoinClientComponent } from './besoin-client/besoin-client.component';
import { HistoriqueChantierComponent } from './historique-chantier/historique-chantier.component';
import { FichierChantierComponent } from './fichier-chantier/fichier-chantier.component';
import { DevisChantierComponent } from './devis/devis.component';
import { StrategieComponent } from './strategie/strategie.component';
import { ZoneInterventionComponent } from './zone-intervention/edit/zone-intervention.component';
import {PageInterventionComponent} from './page-intervention/page-intervention.component';
import {PagePrelevementComponent} from './page-prelevement/page-prelevement.component';
import { HistoriqueStrategieComponent } from './historique-strategie/historique-strategie.component';
import { FichierStrategieComponent } from './fichier-strategie/fichier-strategie.component';


const routes: Routes = [
  { path: '', component: ListeChantierComponent },
  { path: 'liste', component: ListeChantierComponent },
  { path: 'ajouter', component: InformationChantierComponent },
  { path: ':id/informations', component: InformationChantierComponent },
  { path: ':id/sites/liste', component: SiteInterventionComponent },
  { path: ':id/sites/:idSite', component: SiteInterventionComponent },
  { path: ':id/devis/liste', component: DevisChantierComponent },
  { path: ':id/devis/:idDevis', component: DevisChantierComponent },
  { path: ':id/besoin', component: BesoinClientComponent },
  { path: ':id/fichier', component: FichierChantierComponent },
  { path: ':id/historique', component: HistoriqueChantierComponent },

  { path: ':id/strategie/liste', component: StrategieComponent },
  { path: ':id/strategie/historique', component: HistoriqueStrategieComponent },
  { path: ':id/strategie/documents', component: FichierStrategieComponent },
  { path: ':id/strategie/:idStrategie', component: StrategieComponent },
  { path: ':id/strategie/:idStrategie/ajout-zone', component: ZoneInterventionComponent },
  { path: ':id/strategie/:idStrategie/historique', component: HistoriqueStrategieComponent },
  { path: ':id/strategie/:idStrategie/documents', component: FichierStrategieComponent },
  { path: ':id/strategie/:idStrategie/edit-zone/:idZone', component: ZoneInterventionComponent },
  { path: ':id/strategie/:idStrategie/edit-zone/:idZone/:onglet', component: ZoneInterventionComponent },

  { path: ':id/intervention/liste', component: PageInterventionComponent },
  { path: ':id/intervention/ajouter', component: PageInterventionComponent },
  { path: ':id/intervention/:idIntervention/information', component: PageInterventionComponent },
  { path: ':id/intervention/:idIntervention/preparation', component: PageInterventionComponent },
  { path: ':id/intervention/:idIntervention/depart-terrain', component: PageInterventionComponent },
  { path: ':id/intervention/:idIntervention/retour-terrain', component: PageInterventionComponent },
  { path: ':id/intervention/:idIntervention/historique', component: PageInterventionComponent },

  { path: ':id/prelevement/liste', component: PagePrelevementComponent },
  { path: ':id/prelevement/ajouter', component: PagePrelevementComponent },
  { path: ':id/prelevement/:idPrelevement/information', component: PagePrelevementComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChantierRoutingModule { }
