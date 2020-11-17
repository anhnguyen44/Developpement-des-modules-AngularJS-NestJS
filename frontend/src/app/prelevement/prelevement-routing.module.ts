import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagePrelevementComponent} from './page-prelevement/page-prelevement.component';

const routes: Routes = [
    {path: '', component: PagePrelevementComponent},
    {path: ':idPrelevement/information', component: PagePrelevementComponent},
    {path: 'ajouter', component: PagePrelevementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrelevementRoutingModule { }
