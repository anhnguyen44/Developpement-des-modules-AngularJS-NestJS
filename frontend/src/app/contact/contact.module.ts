import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ParametrageModule } from '../parametrage/parametrage.module';
import { ResourceModule } from '../resource/resource.module';
import { CompteComponent } from './compte/compte.component';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact/contact.component';
import { HistoriqueContactComponent } from './historique-contact/historique-contact.component';
import { ListeCompteComponent } from './liste-compte/liste-compte.component';
import { ListeContactComponent } from './liste-contact/liste-contact.component';
import { PageListeContactComponent } from './page-liste-contact/page-liste-contact.component';
import { ActiviteComponent } from './activite/activite.component';
import { ListeActiviteComponent } from './liste-activite/liste-activite.component';
import { ModalContactComponent } from './modal-contact/modal-contact.component';
import {MenuActiviteComponent} from './menu-activite/menu-activite.component';
import {MenuContactComponent} from './menu-contact/menu-contact.component';
import { HistoriqueActiviteComponent } from './historique-activite/historique-activite.component';
import {ProcessusModule} from '../processus/processus.module';
import { PageProcessusComponent } from './page-processus/page-processus.component';
import {ListeProcessusComponent} from '../processus/liste-processus/liste-processus.component';
import {ProcessusComponent} from '../processus/processus/processus.component';

@NgModule({
  declarations: [
      ListeContactComponent,
      ContactComponent,
      CompteComponent,
      ListeCompteComponent,
      PageListeContactComponent,
      HistoriqueContactComponent,
      ActiviteComponent,
      MenuActiviteComponent,
      MenuContactComponent,
      ListeActiviteComponent,
      ModalContactComponent,
      HistoriqueActiviteComponent,
      PageProcessusComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ResourceModule,
    ReactiveFormsModule,
    TooltipModule,
    ClickOutsideModule,
    ParametrageModule,
      ProcessusModule
  ],
    exports: [
        PageListeContactComponent,
        ListeCompteComponent,
        ListeContactComponent,
        ModalContactComponent,
        PageListeContactComponent,
        ContactComponent,
        CompteComponent
    ]
})
export class ContactModule { }
