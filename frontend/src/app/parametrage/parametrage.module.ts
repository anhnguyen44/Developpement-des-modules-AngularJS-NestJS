import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ListeUtilisateurComponent } from './utilisateur/liste/utilisateur-liste.component';
import {UtilisateurComponent} from './utilisateur/utilisateur/utilisateur.component';
import { MenuParametrageComponent } from './menu-parametrage/menu-parametrage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResourceModule } from '../resource/resource.module';
import { FranchiseComponent } from './franchise/franchise.component';
import { BureauComponent } from './bureau/bureau/bureau.component';
import { ListeBureauComponent } from './bureau/liste/liste-bureau.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ListeGrilleTarifComponent } from './tarif/liste/tarif-liste.component';
import { GrilleTarifComponent } from './tarif/tarif/tarif.component';
import { GrilleTarifDetailComponent } from './tarif/tarif-detail/tarif-detail.component';
import { HistoriqueTarifComponent } from './tarif/historique-tarif/historique-tarif.component';
import { ModalUserComponent } from './utilisateur/modal-user/modal-user.component';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
      ListeUtilisateurComponent,
      UtilisateurComponent,
      MenuParametrageComponent,
      FranchiseComponent,
      BureauComponent,
      ListeBureauComponent,
      ListeGrilleTarifComponent,
      GrilleTarifComponent,
      GrilleTarifDetailComponent,
      HistoriqueTarifComponent,
      ModalUserComponent,
  ],
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    ReactiveFormsModule,
    ResourceModule,
    TooltipModule,
    ClickOutsideModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
    exports: [
        ListeUtilisateurComponent,
        UtilisateurComponent,
        MenuParametrageComponent,
        FranchiseComponent,
        ModalUserComponent,
        ListeBureauComponent,
        BureauComponent
      ]
})
export class ParametrageModule { }
