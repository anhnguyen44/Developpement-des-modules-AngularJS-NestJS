import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListeProcessusComponent } from './liste-processus/liste-processus.component';
import { ProcessusComponent } from './processus/processus.component';
import {ResourceModule} from '../resource/resource.module';

@NgModule({
  declarations: [ListeProcessusComponent, ProcessusComponent],
  imports: [
    CommonModule,
      ResourceModule
  ],
    exports: [
        ListeProcessusComponent,
        ProcessusComponent
    ]
})
export class ProcessusModule { }
