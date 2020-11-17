import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeFormationComponent } from './liste-formation/liste-formation.component';
import { FormationComponent } from './formation/formation.component';
import { ListeStagiaireFormationComponent } from './liste-stagiaire-formation/liste-stagiaire-formation.component';
import { ModalStagiaireComponent } from './modal-stagiaire/modal-stagiaire.component';
import { DevisFormationComponent } from './devisFormation/devisFormation.component';
import { HistoriqueFormationComponent } from './historique-formation/historique-formation.component';


const routes: Routes = [
    {path: '', redirectTo: '/formation/liste', pathMatch: 'full'},
    {path: 'liste', component: ListeFormationComponent},
    {path:'ajouter',component: FormationComponent},
    {path:':id/modifier',component: FormationComponent},
    {path:':id/stagiaire',component: ListeStagiaireFormationComponent},
    {path:':id/stagiaire/ajouter',component: ModalStagiaireComponent},
    {path:':id/stagiaire/:idStagiaire/modifier',component: ModalStagiaireComponent},
    {path:':id/devis',component: DevisFormationComponent},
    {path: ':id/historique', component: HistoriqueFormationComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class FormationRoutingModule {}