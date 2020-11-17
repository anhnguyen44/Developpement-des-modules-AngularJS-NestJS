import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompteComponent } from './compte/compte.component';
import { ContactComponent } from './contact/contact.component';
import { HistoriqueContactComponent } from './historique-contact/historique-contact.component';
import { PageListeContactComponent } from './page-liste-contact/page-liste-contact.component';
import { ActiviteComponent } from './activite/activite.component';
import { ListeActiviteComponent } from './liste-activite/liste-activite.component';
import {HistoriqueActiviteComponent} from './historique-activite/historique-activite.component';
import {ListeProcessusComponent} from '../processus/liste-processus/liste-processus.component';
import {PageProcessusComponent} from './page-processus/page-processus.component';

const routes: Routes = [
    {path: '', component: PageListeContactComponent},
    {path: 'contact/ajouter', component: ContactComponent},
    {path: 'contact/:idType/modifier', component: ContactComponent},
    {path: ':type/:idType/activite/ajouter', component: ActiviteComponent},
    {path: ':type/:idType/activite/:id/modifier', component: ActiviteComponent},
    {path: ':type/:idType/activite', component: ListeActiviteComponent},
    {path: 'compte/:idType/processus', component: PageProcessusComponent},
    {path: 'compte/:idType/processus/ajouter', component: PageProcessusComponent},
    {path: 'compte/:idType/processus/:id/modifier', component: PageProcessusComponent},
    {path: 'compte/:idType/processus/:id/historique', component: PageProcessusComponent},
    {path: 'compte/:idType/processus/:id/prelevement', component: PageProcessusComponent},
    {path: 'compte/ajouter', component: CompteComponent},
    {path: 'compte/:idType/modifier', component: CompteComponent},
    {path: 'activite/:id/historique', component: HistoriqueActiviteComponent},
    {path: ':type/:idType/historique', component: HistoriqueContactComponent},
    {path: 'activite', component: ListeActiviteComponent},
    {path: 'activite/ajouter', component: ActiviteComponent},
    {path: 'activite/:id/modifier', component: ActiviteComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
