import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResourceService } from './resource.service';
import { ResourceStoreService } from './resource.store';
import { ApiUrl } from './api-url-injection-token';
import { CiviliteService } from './civilite/civilite.service';
import { PaginationComponent } from './query-builder/pagination/pagination.component';
import { HistoriqueComponent } from './historique/historique.component';
import { LoginService } from './user/login.service';
import { MenuSuperadminComponent } from './menu-superadmin/menu-superadmin.component';
// import { MenuAdminContenuComponent } from './menu-admin-contenu/menu-admin-contenu.component';
import { RouterModule } from '@angular/router';
import { RechercheComponent } from './query-builder/recherche/recherche.component';
import { RechercheUtilisateurComponent } from './recherche-user/recherche-user.component';
import { FichierComponent } from './fichier/fichier.component';
import { ModalFichierComponent } from './fichier/modal-fichier/modal-fichier.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ModalMailComponent } from './mail/modal-mail/modal-mail.component';


import { OrderComponent } from './query-builder/order/order.component';
import { TelephonePipe } from '../telephone.pipe';
import { ClickOutsideModule } from 'ng-click-outside';
import { CarouselComponent, CarouselItemElement } from '../carousel/carousel.component';
import { CarouselItemDirective } from '../carousel/carousel-item.directive';
import { SpacerComponent } from '../spacer/spacer.component';
import { InputCpVilleComponent } from './input-cp-ville/input-cp-ville.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './map/map.component';
import { BatimentComponent } from './batiment/batiment.component';
import { ModalBatimentComponent } from './batiment/modal-batiment/modal-batiment.component';
import { TypeBatimentService } from './type-batiment/type-batiment.service';
import { BesoinClientComponent } from '../chantier/besoin-client/besoin-client.component';
import { BesoinClientLaboService } from './besoin-client/besoin-client.service';
import { PlanningComponent } from './planning/planning.component';
import {
    CalendarDateFormatter,
    CalendarModule,
    CalendarNativeDateFormatter,
    DateAdapter,
    DateFormatterParams
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateFormatter } from './planning/CustomDateFormatter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionGroupComponent } from './accordion/accordion-group.component';
import { ZoneInterventionService } from './zone-intervention/zone-intervention.service';
import { ListeComponent } from './liste/liste.component';
import { HorairesOccupationLocauxService } from './horaires-occupation/horaires-occupation.service';
import { ProcessusZoneService } from './processus-zone/processus-zone.service';
import { EnvironnementService } from './environnement/environnement.service';
import { GESService } from './processus-zone/ges.service';
import { CallbackPipe } from './callback.pipe';
import { FilterPipe } from './filter.pipe';
import { EchantillonnageService } from './echantillonnage/echantillonnage.service';
import { NotificationUserService } from './notif-user/notif-user.service';
import { NotificationUserComponent } from '../notif-user/notif-user.component';
import { Safe } from './safe-html.pipe';

import { TinyMceComponent } from './tiny-mce/tiny-mce.component';
// Config editor change
import { EditorModule } from '@tinymce/tinymce-angular';
import { SafeStyle } from './safe-style.pipe';
import { MenuAdminContenuComponent } from './menu-admin-contenu/menu-admin-contenu.component';
import { ModalContenuComponent } from './modal-contenu/modal-contenu.component';
import { ResetPasswordComponent } from '../user/reset-password/reset-password.component';
import { EnumPipe } from '../enum.pipe';
import { DebounceClickDirective } from '../chantier/debounce/debounce-directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }, {
                dateFormatter: {
                    provide: CalendarDateFormatter,
                    useClass: CustomDateFormatter
                }
            }),
        FormsModule,
        RouterModule,
        ClickOutsideModule,
        TooltipModule,
        LeafletModule,
        EditorModule
    ],
    declarations: [
        PaginationComponent,
        HistoriqueComponent,
        MenuSuperadminComponent,
        // MenuAdminContenuComponent,
        RechercheComponent,
        RechercheUtilisateurComponent,
        FichierComponent,
        ModalFichierComponent,
        ModalMailComponent,
        OrderComponent,
        TelephonePipe,
        CarouselComponent,
        CarouselItemDirective,
        CarouselItemElement,
        SpacerComponent,
        InputCpVilleComponent,
        ComboBoxComponent,
        MapComponent,
        BatimentComponent,
        ModalBatimentComponent,
        PlanningComponent,
        AccordionComponent,
        AccordionGroupComponent,
        ListeComponent,
        CallbackPipe,
        FilterPipe,
        NotificationUserComponent,
        Safe,
        SafeStyle,
        TinyMceComponent,
        MenuAdminContenuComponent,
        ModalContenuComponent,
        EnumPipe
    ],
    exports: [
        PaginationComponent,
        HistoriqueComponent,
        FormsModule,
        ReactiveFormsModule,
        MenuSuperadminComponent,
        // MenuAdminContenuComponent,
        RechercheComponent,
        RechercheUtilisateurComponent,
        FichierComponent,
        ModalFichierComponent,
        ModalMailComponent,
        OrderComponent,
        TelephonePipe,
        CarouselComponent,
        CarouselItemDirective,
        CarouselItemElement,
        SpacerComponent,
        InputCpVilleComponent,
        ComboBoxComponent,
        MapComponent,
        BatimentComponent,
        ModalBatimentComponent,
        PlanningComponent,
        ClickOutsideModule,
        AccordionComponent,
        AccordionGroupComponent,
        ListeComponent,
        CallbackPipe,
        FilterPipe,
        Safe,
        NotificationUserComponent,
        PlanningComponent,
        TinyMceComponent,
        ModalContenuComponent,
        EnumPipe
    ]
})

export class ResourceModule {
    static forRoot(apiUrl: string) {
        return {
            ngModule: ResourceModule,
            providers: [
                { provide: ApiUrl, useValue: apiUrl },
                ResourceService,
                ResourceStoreService,
                CiviliteService,
                LoginService,
                TypeBatimentService,
                BesoinClientLaboService,
                ZoneInterventionService,
                HorairesOccupationLocauxService,
                ProcessusZoneService,
                EnvironnementService,
                GESService,
                EchantillonnageService,
                NotificationUserService,
            ]
        };
    }
}
