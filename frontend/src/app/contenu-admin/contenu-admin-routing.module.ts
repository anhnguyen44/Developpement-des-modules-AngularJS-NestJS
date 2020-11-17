import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeComponent } from './contenu/liste/liste.component';
import { ListeMenuComponent } from './menu/liste-menu/liste-menu.component';
import { MenusComponent } from './menu/menus/menus.component';
import { ListeCategorieComponent } from './categorie-menu/liste-categorie/liste-categorie.component';
import { CategorieMenusComponent } from './categorie-menu/categorie-menus/categorie-menus.component';
import { ContenusComponent } from './contenu/contenus/contenus.component';
import {SuperAdminGuardService} from '../superadmin/superadmin-guard-service';
import {ProfilsGuardService} from '../profils-guard-service';
import {profils} from '@aleaac/shared';

const enumProfils = profils;


const routes: Routes = [
    {path: '', redirectTo: '/contenu-admin/contenu/liste', pathMatch: 'full'},
    {path: 'contenu/liste', component: ListeComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'contenu/ajouter', component: ContenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'contenu/modifier/:id', component: ContenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'menu/liste-menu', component: ListeMenuComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'menu/ajouter', component: MenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'menu/modifier/:id', component: MenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'catogorie-menu/liste-categorie', component: ListeCategorieComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'catogorie-menu/ajouter', component: CategorieMenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
    {path: 'catogorie-menu/modifier/:id', component: CategorieMenusComponent, canActivate: [ProfilsGuardService], data: {profils: [enumProfils.ADMIN_CONTENU]}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ContenuAdminRoutingModule { }