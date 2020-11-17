import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './resource/user/auth-guard.service';
import { LoginComponent } from './user/login/login.component';

import { ProfileComponent } from './user/profile/profile.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { NotificationUserComponent } from './notif-user/notif-user.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'doResetPassword/:token', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'chantier', loadChildren: './chantier/chantier.module#ChantierModule', canActivate: [AuthGuardService] },
  { path: 'parametrage', loadChildren: './parametrage/parametrage.module#ParametrageModule', canActivate: [AuthGuardService] },
  { path: 'contact', loadChildren: './contact/contact.module#ContactModule', canActivate: [AuthGuardService] },
  { path: 'superadmin', loadChildren: './superadmin/superadmin.module#SuperadminModule', canActivate: [AuthGuardService] },
  { path: 'contenu-admin', loadChildren: './contenu-admin/contenu-admin.module#ContenuAdminModule', canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] } /* work in progress */,
  { path: 'devis-commande', loadChildren: './devis-commande/devis-commande.module#DevisCommandeModule', canActivate: [AuthGuardService] },
  { path: 'logistique', loadChildren: './logistique/logistique.module#LogistiqueModule', canActivate: [AuthGuardService]},
  { path: 'prelevement', loadChildren: './prelevement/prelevement.module#PrelevementModule', canActivate: [AuthGuardService]},
  { path: 'intervention', loadChildren: './intervention/intervention.module#InterventionModule', canActivate: [AuthGuardService]},
  { path: 'notifications', component: NotificationUserComponent, canActivate: [AuthGuardService]},
  { path: 'contenu', loadChildren: './contenu/contenu.module#ContenuModule', canActivate: [AuthGuardService]},
  { path: 'formation', loadChildren: './formation/formation.module#FormationModule', canActivate: [AuthGuardService]},
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, routerOptions)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
