import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DroitComponent } from './droit/droit/sa-droit.component';
import { ListeDroitComponent } from './droit/liste/sa-droit-liste.component';
import { ListeProfilComponent } from './profil/liste/sa-profil-liste.component';
import { ProfilComponent } from './profil/profil/sa-profil.component';
import { SuperAdminGuardService } from './superadmin-guard-service';
import { UtilisateurSuperAdminComponent } from './utilisateur-super-admin/utilisateur/utilisateur-super-admin.component';
import { ListeFranchiseComponent } from './franchise/liste/sa-franchise-liste.component';
import { SAFranchiseComponent } from './franchise/franchise/sa-franchise.component';
import { ListeUtilisateurSuperAdminComponent } from './utilisateur-super-admin/liste/liste-utilisateur-super-admin.component';
import { ListeProduitComponent } from './produit/liste/sa-produit-liste.component';
import { ProduitComponent } from './produit/produit/sa-produit.component';
import { BureauSAComponent } from './bureau/bureau/bureau.component';
import { ListeBureauSAComponent } from './bureau/liste-bureau/liste-bureau.component';
import { TypeFichierComponent } from './typefichier/type-fichier/type-fichier.component';
import { ImportlisteComponent } from './importliste/importliste.component';
import { TemplatesComponent } from './templates/templates.component';
import { TypeFormationComponent } from './typeformation/type-formation/type-formation.component';
import { DomaineCompetenceComponent } from './domaineCompetence/domaine-competence/domaine-competence.component';

const routes: Routes = [
  { path: '', redirectTo: '/superadmin/franchise/liste', pathMatch: 'full' },
  { path: 'franchise/liste', component: ListeFranchiseComponent, canActivate: [SuperAdminGuardService] },
  { path: 'franchise/ajouter', component: SAFranchiseComponent, canActivate: [SuperAdminGuardService] },
  { path: 'franchise/modifier/:id', component: SAFranchiseComponent, canActivate: [SuperAdminGuardService] },
  { path: 'profil/liste', component: ListeProfilComponent, canActivate: [SuperAdminGuardService] },
  { path: 'profil/ajouter', component: ProfilComponent, canActivate: [SuperAdminGuardService] },
  { path: 'profil/modifier/:id', component: ProfilComponent, canActivate: [SuperAdminGuardService] },
  { path: 'droit/liste', component: ListeDroitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'droit/ajouter', component: DroitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'droit/modifier/:id', component: DroitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'utilisateur/liste', component: ListeUtilisateurSuperAdminComponent, canActivate: [SuperAdminGuardService] },
  { path: 'utilisateur/ajouter', component: UtilisateurSuperAdminComponent, canActivate: [SuperAdminGuardService] },
  { path: 'utilisateur/modifier/:id', component: UtilisateurSuperAdminComponent, canActivate: [SuperAdminGuardService] },
  { path: 'produit/liste', component: ListeProduitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'produit/ajouter', component: ProduitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'produit/modifier/:id', component: ProduitComponent, canActivate: [SuperAdminGuardService] },
  { path: 'bureau', component: ListeBureauSAComponent, canActivate: [SuperAdminGuardService] },
  { path: 'bureau/liste', component: ListeBureauSAComponent, canActivate: [SuperAdminGuardService] },
  { path: 'bureau/liste/:superAdminFranchiseId', component: ListeBureauSAComponent, canActivate: [SuperAdminGuardService] },
  { path: 'bureau/ajouter/:superAdminFranchiseId', component: BureauSAComponent, canActivate: [SuperAdminGuardService] },
  { path: 'bureau/modifier/:superAdminId', component: BureauSAComponent, canActivate: [SuperAdminGuardService] },
  { path: 'typefichier', component: TypeFichierComponent, canActivate: [SuperAdminGuardService] },
  { path: 'importliste', component: ImportlisteComponent, canActivate: [SuperAdminGuardService] },
  { path: 'templates', component: TemplatesComponent, canActivate: [SuperAdminGuardService] },
  { path: 'typeformation', component: TypeFormationComponent, canActivate: [SuperAdminGuardService] },
  { path: 'domaineCompetence', component: DomaineCompetenceComponent, canActivate: [SuperAdminGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
