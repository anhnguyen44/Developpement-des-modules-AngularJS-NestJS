import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuComponent } from './contenu/contenu.component';
import { ListeContenuComponent } from './liste-contenu/liste-contenu.component';
import {ResourceModule} from '../resource/resource.module';
import {ContenuRoutingModule} from './contenu-routing.module';

@NgModule({
  declarations: [ContenuComponent, ListeContenuComponent],
  imports: [
    CommonModule,
      ContenuRoutingModule,
      ResourceModule,
  ]
})
export class ContenuModule { }
