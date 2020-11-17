import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionRoutingModule } from './intervention-routing.module';
import { ListeInterventionComponent } from './liste-intervention/liste-intervention.component';
import { InterventionComponent } from './intervention/intervention.component';
import {ResourceModule} from '../resource/resource.module';
import {LogistiqueModule} from '../logistique/logistique.module';
import {PrelevementModule} from '../prelevement/prelevement.module';
import { MenuInterventionComponent } from './menu-intervention/menu-intervention.component';
import { PageInterventionComponent } from './page-intervention/page-intervention.component';
import { HistoriqueInterventionComponent } from './historique-intervention/historique-intervention.component';
import { PreparationInterventionComponent } from './preparation-intervention/preparation-intervention.component';
import { DepartInterventionComponent } from './depart-intervention/depart-intervention.component';
import {ContactModule} from '../contact/contact.module';
import { ModalOrigineValidationComponent } from './modal-origine-validation/modal-origine-validation.component';
import { PageRetourInterventionComponent } from './retour-intervention/page-retour-intervention/page-retour-intervention.component';
import { MetaOperateurAvantComponent } from './retour-intervention/meta-operateur-avant/meta-operateur-avant.component';
import { MetaOperateurPendantComponent } from './retour-intervention/meta-operateur-pendant/meta-operateur-pendant.component';
import { MetaOperateurApresComponent } from './retour-intervention/meta-operateur-apres/meta-operateur-apres.component';
import { PrelevementPointFixeComponent } from './retour-intervention/prelevement-point-fixe/prelevement-point-fixe.component';
import { PrelevementMestComponent } from './retour-intervention/prelevement-mest/prelevement-mest.component';

@NgModule({
  declarations: [
      ListeInterventionComponent,
      InterventionComponent,
      MenuInterventionComponent,
      PageInterventionComponent,
      HistoriqueInterventionComponent,
      PreparationInterventionComponent,
      DepartInterventionComponent,
      ModalOrigineValidationComponent,
      PageRetourInterventionComponent,
      MetaOperateurAvantComponent,
      MetaOperateurPendantComponent,
      MetaOperateurApresComponent,
      PrelevementPointFixeComponent,
      PrelevementMestComponent
  ],
  imports: [
    CommonModule,
    InterventionRoutingModule,
      ResourceModule,
      LogistiqueModule,
      PrelevementModule,
      ContactModule
  ],
    exports: [
        ListeInterventionComponent,
        InterventionComponent,
        MenuInterventionComponent,
        HistoriqueInterventionComponent,
        PreparationInterventionComponent,
        DepartInterventionComponent,
        PageRetourInterventionComponent,
        MetaOperateurAvantComponent,
        MetaOperateurPendantComponent,
        MetaOperateurApresComponent,
        PrelevementPointFixeComponent
    ]
})
export class InterventionModule { }
