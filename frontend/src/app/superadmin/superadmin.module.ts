import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResourceModule } from '../resource/resource.module';
import { ListeProfilComponent } from './profil/liste/sa-profil-liste.component';
import { ProfilComponent } from './profil/profil/sa-profil.component';
import { ListeDroitComponent } from './droit/liste/sa-droit-liste.component';
import { DroitComponent } from './droit/droit/sa-droit.component';
import { UtilisateurSuperAdminComponent } from './utilisateur-super-admin/utilisateur/utilisateur-super-admin.component';
import { ListeFranchiseComponent } from './franchise/liste/sa-franchise-liste.component';
import { SAFranchiseComponent } from './franchise/franchise/sa-franchise.component';
import { ParametrageModule } from '../parametrage/parametrage.module';
import { ListeUtilisateurSuperAdminComponent } from './utilisateur-super-admin/liste/liste-utilisateur-super-admin.component';
import { ProduitComponent } from './produit/produit/sa-produit.component';
import { ListeProduitComponent } from './produit/liste/sa-produit-liste.component';
import { registerLocaleData } from '@angular/common';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BureauSAComponent } from './bureau/bureau/bureau.component';
import { ListeBureauSAComponent } from './bureau/liste-bureau/liste-bureau.component';
import { TypeFichierComponent } from './typefichier/type-fichier/type-fichier.component';
import { ModalTypeFichierComponent } from './typefichier/modal-type-fichier/modal-type-fichier.component';
import { ImportlisteComponent } from './importliste/importliste.component';
import { TemplatesComponent } from './templates/templates.component';
import { TypeFormationComponent } from './typeformation/type-formation/type-formation.component';
import { ModalTypeFormationComponent } from './typeformation/modal-type-formation/modal-type-formation.component';
import { DomaineCompetenceComponent } from './domaineCompetence/domaine-competence/domaine-competence.component';
import { ModalDomaineCompetenceComponent } from './domaineCompetence/modal-domaine-competence/modal-domaine-competence.component';
import { ModalListeTypeFormation } from './typeformation/modal-liste-type-formation/modal-liste-type-formation.component';

@NgModule({
  declarations: [
    ListeProfilComponent,
    ProfilComponent,
    ListeDroitComponent,
    DroitComponent,
    UtilisateurSuperAdminComponent,
    ListeUtilisateurSuperAdminComponent,
    ListeFranchiseComponent,
    SAFranchiseComponent,
    ProduitComponent,
    ListeProduitComponent,
    BureauSAComponent,
    ListeBureauSAComponent,
    TypeFichierComponent,
    ModalTypeFichierComponent,
    ImportlisteComponent,
    TemplatesComponent,
    TypeFormationComponent,
    ModalTypeFormationComponent,
    DomaineCompetenceComponent,
    ModalDomaineCompetenceComponent,
    ModalListeTypeFormation
  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    ReactiveFormsModule,
    ResourceModule,
    ParametrageModule,
    TooltipModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SuperadminRoutingModule,
    ListeProfilComponent,
    ProfilComponent,
    ListeDroitComponent,
    DroitComponent,
    ListeFranchiseComponent,
    SAFranchiseComponent,
    UtilisateurSuperAdminComponent,
    ListeUtilisateurSuperAdminComponent,
    ProduitComponent,
    ListeProduitComponent,
    TemplatesComponent,
    TypeFormationComponent,
    ModalListeTypeFormation
  ],
  providers: [
  ]
})
export class SuperadminModule { }
