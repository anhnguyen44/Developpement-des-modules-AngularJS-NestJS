import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListeUtilisateurComponent} from './utilisateur/liste/utilisateur-liste.component';
import {UtilisateurComponent} from './utilisateur/utilisateur/utilisateur.component';
import {FranchiseComponent} from './franchise/franchise.component';
import {ListeBureauComponent} from './bureau/liste/liste-bureau.component';
import {BureauComponent} from './bureau/bureau/bureau.component';
import { ParametrageFranchiseGuardService } from './parametrage-franchise-guard-service';
import { ParametrageGuardService } from './parametrage-guard-service';
import { AuthGuardService } from '../resource/user/auth-guard.service';
import { ListeGrilleTarifComponent } from './tarif/liste/tarif-liste.component';
import { GrilleTarifComponent } from './tarif/tarif/tarif.component';
import { GrilleTarifDetailComponent } from './tarif/tarif-detail/tarif-detail.component';
import { HistoriqueTarifComponent } from './tarif/historique-tarif/historique-tarif.component';

const routes: Routes = [
    {path: '', redirectTo: '/parametrage/franchise', pathMatch: 'full'},
    {path: 'franchise', component: FranchiseComponent, canActivate: [ParametrageFranchiseGuardService]},
    {path: 'bureau', component: ListeBureauComponent, canActivate: [ParametrageFranchiseGuardService]},
    {path: 'bureau/ajouter', component: BureauComponent, canActivate: [ParametrageFranchiseGuardService]},
    {path: 'bureau/modifier/:id', component: BureauComponent, canActivate: [ParametrageFranchiseGuardService]},
    {path: 'utilisateur/liste', component: ListeUtilisateurComponent, canActivate: [ParametrageGuardService]},
    {path: 'utilisateur/ajouter', component: UtilisateurComponent, canActivate: [ParametrageGuardService]},
    {path: 'utilisateur/modifier/:id', component: UtilisateurComponent, canActivate: [ParametrageGuardService]},
    {path: 'grilleTarif/liste', component: ListeGrilleTarifComponent, canActivate: [ParametrageGuardService]},
    {path: 'grilleTarif/ajouter', component: GrilleTarifComponent, canActivate: [ParametrageGuardService]},
    {path: 'grilleTarif/modifier/informations/:id', component: GrilleTarifComponent, canActivate: [ParametrageGuardService]},
    {path: 'grilleTarif/modifier/details/:id', component: GrilleTarifDetailComponent, canActivate: [ParametrageGuardService]},
    {path: 'grilleTarif/modifier/historique/:id', component: HistoriqueTarifComponent, canActivate: [ParametrageGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
