import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevisCommandeRoutingModule } from './devis-commande-routing.module';
import { ListeDevisCommandeComponent } from './liste-devis-commande/liste-devis-commande.component';
import { ResourceModule } from '../resource/resource.module';
import { InformationDevisCommandeComponent } from './information-devis-commande/information-devis-commande.component';
import { MenuDevisCommandeComponent } from './menu-devis-commande/menu-devis-commande.component';
import { DetailDevisCommandeComponent } from './detail-devis-commande/detail-devis-commande.component';
import { FichierDevisCommandeComponent } from './fichier-devis-commande/fichier-devis-commande.component';
import { HistoriqueDevisCommandeComponent } from './historique-devis-commande/historique-devis-commande.component';
import { ModalClientComponent } from './modal-client/modal-client.component';
import { ContactModule } from '../contact/contact.module';
import { ModalProduitComponent } from './modal-produit/modal-produit.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { ModalAbandonCommandeComponent } from './modal-abandon/modal-abandon.component';
import { TruncatePipe } from './truncate.pipe';
import { ContactDevisCommandeComponent } from './contact-devis-commande/contact-devis-commande.component';
import { ModalListeChantierComponent } from './modal-liste-chantier/modal-liste-chantier.component';
import { ListeChantierDevisComponent } from './liste-chantier/liste-chantier.component';
import { ModalSessionFormationComponent } from './modal-session-formation/modal-session-formation.component';

@NgModule({
  declarations: [ListeDevisCommandeComponent, InformationDevisCommandeComponent,
    MenuDevisCommandeComponent, DetailDevisCommandeComponent, FichierDevisCommandeComponent,
    HistoriqueDevisCommandeComponent, ModalClientComponent, ModalProduitComponent, ModalAbandonCommandeComponent,
    TruncatePipe,
    ContactDevisCommandeComponent,
    DetailDevisCommandeComponent,
    ModalListeChantierComponent,
    ListeChantierDevisComponent,
    ModalSessionFormationComponent
  ],
  imports: [
    CommonModule,
    DevisCommandeRoutingModule,
    ResourceModule,
    ContactModule,
    ClickOutsideModule,
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr-FR' // 'de-DE' for Germany, 'fr-FR' for France ...
  },
  ],
  exports: [
    ListeDevisCommandeComponent,
    DetailDevisCommandeComponent,
    ModalProduitComponent,
    ModalListeChantierComponent,
    ListeChantierDevisComponent,
    ModalSessionFormationComponent
  ]
})
export class DevisCommandeModule { }
