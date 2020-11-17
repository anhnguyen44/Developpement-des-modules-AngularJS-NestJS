import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {AppRoutingModule} from './/app-routing.module';
import {TopnavComponent} from './topnav/topnav.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserModule} from './resource/user/user.module';
import {environment} from '../environments/environment';
import {AuthHeaderInterceptor} from './resource/user/auth.http.interceptor';
import { MenuComponent } from './menu/menu.component';
import {ResourceModule} from './resource/resource.module';
import { NotificationComponent } from './notification/notification.component';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { registerLocaleData } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptorService } from './loader-interceptor-service';
import { RecaptchaModule, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ClickOutsideModule} from 'ng-click-outside';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    PageNotFoundComponent,
    DashboardComponent,
    MenuComponent,
    NotificationComponent,
    LoaderComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    ClickOutsideModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ResourceModule.forRoot(environment.api),
    UserModule.forRoot(environment.api),
    RecaptchaModule,
    LeafletModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'fr', // use French language
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6LcShykUAAAAABdza2v650f5yRyn1dAx944dmL10' } as RecaptchaSettings,
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR' // 'de-DE' for Germany, 'fr-FR' for France ...
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
