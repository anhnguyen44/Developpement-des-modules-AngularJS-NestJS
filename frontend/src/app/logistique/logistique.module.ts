import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogistiqueRoutingModule } from './logistique-routing.module';
import { ListeLotFiltreComponent } from './liste-lot-filtre/liste-lot-filtre.component';
import { LotFiltreComponent } from './lot-filtre/lot-filtre.component';
import { ListePompeComponent } from './liste-pompe/liste-pompe.component';
import { PompeComponent } from './pompe/pompe.component';
import { ListeConsommableComponent } from './liste-consommable/liste-consommable.component';
import { ConsommableComponent } from './consommable/consommable.component';
import { ListeSalleComponent } from './liste-salle/liste-salle.component';
import { SalleComponent } from './salle/salle.component';
import { ListeRessourceHumaineComponent } from './liste-ressource-humaine/liste-ressource-humaine.component';
import { RessourceHumaineComponent } from './ressource-humaine/ressource-humaine.component';
import { MenuLogistiqueComponent } from './menu-logistique/menu-logistique.component';
import {ResourceModule} from '../resource/resource.module';
import { ModalBlancLotFiltreComponent } from './modal-blanc-lot-filtre/modal-blanc-lot-filtre.component';
import { ModalConsommableComponent } from './modal-consommable/modal-consommable.component';
import { PagePlanningComponent } from './page-planning/page-planning.component';
import { ModalPompeComponent } from './modal-pompe/modal-pompe.component';
import { ModalRessourceHumaineComponent } from './modal-ressource-humaine/modal-ressource-humaine.component';
import { PlanningComponent } from '../resource/planning/planning.component';
import { ModalIndisponibiliteComponent } from './modal-indisponibilite/modal-indisponibilite.component';
import {ParametrageModule} from '../parametrage/parametrage.module';
import { StationMeteoComponent } from './station-meteo/station-meteo.component';
import { ListeStationMeteoComponent } from './liste-station-meteo/liste-station-meteo.component';
import {DebitmetreComponent} from './debitmetre/debitmetre.component';
import {ListeDebimetreComponent} from './liste-debitmetre/liste-debimetre.component';

@NgModule({
  declarations: [
      ListeLotFiltreComponent,
      LotFiltreComponent,
      ListePompeComponent,
      PompeComponent,
      ListeConsommableComponent,
      ConsommableComponent,
      ListeSalleComponent,
      SalleComponent,
      ListeRessourceHumaineComponent,
      RessourceHumaineComponent,
      MenuLogistiqueComponent,
      ModalBlancLotFiltreComponent,
      ModalConsommableComponent,
      PagePlanningComponent,
      ModalPompeComponent,
      ModalRessourceHumaineComponent,
      ModalIndisponibiliteComponent,
      StationMeteoComponent,
      ListeStationMeteoComponent,
      DebitmetreComponent,
      ListeDebimetreComponent
  ],
  imports: [
    CommonModule,
    LogistiqueRoutingModule,
    ResourceModule,
      ParametrageModule
  ],
    exports: [
        ModalPompeComponent,
        ModalRessourceHumaineComponent
    ]
})
export class LogistiqueModule { }
