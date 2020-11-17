import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListeLotFiltreComponent} from './liste-lot-filtre/liste-lot-filtre.component';
import {ListePompeComponent} from './liste-pompe/liste-pompe.component';
import {ListeConsommableComponent} from './liste-consommable/liste-consommable.component';
import {ListeRessourceHumaineComponent} from './liste-ressource-humaine/liste-ressource-humaine.component';
import {ListeSalleComponent} from './liste-salle/liste-salle.component';
import {LotFiltreComponent} from './lot-filtre/lot-filtre.component';
import {PompeComponent} from './pompe/pompe.component';
import {ConsommableComponent} from './consommable/consommable.component';
import {RessourceHumaineComponent} from './ressource-humaine/ressource-humaine.component';
import {SalleComponent} from './salle/salle.component';
import {PagePlanningComponent} from './page-planning/page-planning.component';
import {ListeStationMeteoComponent} from './liste-station-meteo/liste-station-meteo.component';
import {StationMeteoComponent} from './station-meteo/station-meteo.component';
import {ListeDebimetreComponent} from './liste-debitmetre/liste-debimetre.component';
import {DebitmetreComponent} from './debitmetre/debitmetre.component';

const routes: Routes = [
    {path: '', redirectTo: 'ressource-humaine', pathMatch: 'full'},
    {path: 'lot-filtre', component: ListeLotFiltreComponent},
    {path: 'lot-filtre/ajouter', component: LotFiltreComponent},
    {path: 'lot-filtre/modifier/:id', component: LotFiltreComponent},
    {path: 'pompe', component: ListePompeComponent},
    {path: 'pompe/ajouter', component: PompeComponent},
    {path: 'pompe/modifier/:id', component: PompeComponent},
    {path: 'consommable', component: ListeConsommableComponent},
    {path: 'consommable/ajouter', component: ConsommableComponent},
    {path: 'consommable/modifier/:id', component: ConsommableComponent},
    {path: 'debitmetre', component: ListeDebimetreComponent},
    {path: 'debitmetre/ajouter', component: DebitmetreComponent},
    {path: 'debitmetre/modifier/:id', component: DebitmetreComponent},
    {path: 'station-meteo', component: ListeStationMeteoComponent},
    {path: 'station-meteo/ajouter', component: StationMeteoComponent},
    {path: 'station-meteo/modifier/:id', component: StationMeteoComponent},
    {path: 'ressource-humaine', component: ListeRessourceHumaineComponent},
    {path: 'ressource-humaine/ajouter', component: RessourceHumaineComponent},
    {path: 'ressource-humaine/modifier/:id', component: RessourceHumaineComponent},
    {path: 'salle', component: ListeSalleComponent},
    {path: 'salle/ajouter', component: SalleComponent},
    {path: 'salle/modifier/:id', component: SalleComponent},
    {path: 'planning', component: PagePlanningComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogistiqueRoutingModule { }
