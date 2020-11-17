import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrelevementRoutingModule } from './prelevement-routing.module';
import { ListePrelevementComponent } from './liste-prelevement/liste-prelevement.component';
import { PrelevementComponent } from './prelevement/prelevement.component';
import { PagePrelevementComponent } from './page-prelevement/page-prelevement.component';
import {ResourceModule} from '../resource/resource.module';
import { ModalPrelevementComponent } from './modal-prelevement/modal-prelevement.component';

@NgModule({
  declarations: [ListePrelevementComponent, PrelevementComponent, PagePrelevementComponent, ModalPrelevementComponent],
  imports: [
    CommonModule,
    PrelevementRoutingModule,
    ResourceModule
  ],
    exports: [
      ListePrelevementComponent, ModalPrelevementComponent, PrelevementComponent
    ]
})
export class PrelevementModule { }
