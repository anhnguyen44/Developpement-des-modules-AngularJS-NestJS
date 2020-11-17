import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeFormationComponent } from './liste-formation/liste-formation.component';

import { ResourceModule } from '../resource/resource.module';
import { FormationRoutingModule } from './formation-routing.module';
import { FormationComponent } from './formation/formation.component';
import { MenuFormationComponent } from './menu-formation/menu-formation.component';
import { ListeStagiaireFormationComponent } from './liste-stagiaire-formation/liste-stagiaire-formation.component';
import { ModalStagiaireComponent } from './modal-stagiaire/modal-stagiaire.component';
import { ContactModule } from '../contact/contact.module';
import { ModalGenerationComponent } from './modal-generation/modal-generation.component';
import { SuperadminModule } from '../superadmin/superadmin.module';
import { DevisFormationComponent } from './devisFormation/devisFormation.component';
import { DevisCommandeModule } from '../devis-commande/devis-commande.module';
import { HistoriqueFormationComponent } from './historique-formation/historique-formation.component';

@NgModule({
  declarations: [ListeFormationComponent, FormationComponent,MenuFormationComponent,ListeStagiaireFormationComponent, ModalStagiaireComponent, ModalGenerationComponent,DevisFormationComponent,HistoriqueFormationComponent],
  imports: [
    CommonModule,
     FormationRoutingModule,
      ResourceModule,
      ContactModule,
      SuperadminModule,
      DevisCommandeModule,
  ], exports:
  [
    ListeFormationComponent
  ]
})
export class FormationModule { }