import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContenuComponent} from './contenu/contenu.component';
import {ListeContenuComponent} from './liste-contenu/liste-contenu.component';

const routes: Routes = [
    {path: 'liste/:id', component: ListeContenuComponent},
    {path: 'listeArticle/:express', component: ListeContenuComponent},
    {path: ':id', component: ContenuComponent},
    {path: 'article/:expression', component: ContenuComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ContenuRoutingModule {}