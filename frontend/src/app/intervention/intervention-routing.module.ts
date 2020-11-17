import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListeInterventionComponent} from './liste-intervention/liste-intervention.component';
import {InterventionComponent} from './intervention/intervention.component';
import {PageInterventionComponent} from './page-intervention/page-intervention.component';

const routes: Routes = [
    {path: '', component: PageInterventionComponent},
    {path: 'ajouter', component: PageInterventionComponent},
    {path: ':idIntervention/information', component: PageInterventionComponent},
    {path: ':idIntervention/preparation', component: PageInterventionComponent},
    {path: ':idIntervention/depart-terrain', component: PageInterventionComponent},
    {path: ':idIntervention/retour-terrain', component: PageInterventionComponent},
    {path: ':idIntervention/historique', component: PageInterventionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionRoutingModule { }
