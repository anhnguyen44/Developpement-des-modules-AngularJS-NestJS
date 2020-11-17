import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListeDevisCommandeComponent} from './liste-devis-commande/liste-devis-commande.component';
import {InformationDevisCommandeComponent} from './information-devis-commande/information-devis-commande.component';
import {DetailDevisCommandeComponent} from './detail-devis-commande/detail-devis-commande.component';
import {FichierDevisCommandeComponent} from './fichier-devis-commande/fichier-devis-commande.component';
import {HistoriqueDevisCommandeComponent} from './historique-devis-commande/historique-devis-commande.component';
import {ContactDevisCommandeComponent} from './contact-devis-commande/contact-devis-commande.component';

const routes: Routes = [
    {path: '', component: ListeDevisCommandeComponent},
    {path: 'ajouter', component: InformationDevisCommandeComponent},
    {path: ':id/modifier', component: InformationDevisCommandeComponent},
    {path: ':id/detail', component: DetailDevisCommandeComponent},
    {path: ':id/fichier', component: FichierDevisCommandeComponent},
    {path: ':id/historique', component: HistoriqueDevisCommandeComponent},
    {path: ':id/interlocuteur', component: ContactDevisCommandeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevisCommandeRoutingModule { }
