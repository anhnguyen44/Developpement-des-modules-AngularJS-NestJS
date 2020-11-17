  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { ResourceModule } from '../resource/resource.module';
import { ContenuAdminRoutingModule } from './contenu-admin-routing.module';
import { ContenusComponent } from './contenu/contenus/contenus.component';
import { ListeComponent } from './contenu/liste/liste.component';
import { MenusComponent } from './menu/menus/menus.component';
import { ListeMenuComponent } from './menu/liste-menu/liste-menu.component';

import { MenuAdminContenuComponent } from './menu-admin-contenu/menu-admin-contenu.component';
import { ModalIconeComponent } from './modal-icone/modal-icone.component';
import { CategorieMenusComponent } from './categorie-menu/categorie-menus/categorie-menus.component';
import { ListeCategorieComponent } from './categorie-menu/liste-categorie/liste-categorie.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [ListeCategorieComponent, CategorieMenusComponent, ContenusComponent, ListeComponent, MenusComponent, ListeMenuComponent, MenuAdminContenuComponent, ModalIconeComponent],
  imports: [
    CommonModule,
    ContenuAdminRoutingModule,
    ResourceModule,
    HttpClientModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ContenuAdminRoutingModule
  ],
  providers: [
  ] 
})
export class ContenuAdminModule { }
