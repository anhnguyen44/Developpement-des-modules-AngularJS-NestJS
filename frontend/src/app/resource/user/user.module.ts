import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';

import { LoginService } from './login.service';
import { ApiUrl } from '../api-url';
import { LoginComponent } from '../../user/login/login.component';
import { ProfileComponent } from '../../user/profile/profile.component';
import { UserService } from './user.service';
import { UserStore } from './user.store';
import { TokenStorage } from './token.storage';
import { RecaptchaModule, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ResourceModule } from '../resource.module';
import { AppModule } from '../../app.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatCardModule,
     HttpClientModule, RecaptchaModule, RecaptchaFormsModule, ResourceModule],
  declarations: [LoginComponent, ProfileComponent],
  exports: [LoginComponent, ProfileComponent]
})
export class UserModule {
  static forRoot(apiUrl: string) {
    return {
      ngModule: UserModule,
      providers: [
        {
          provide: ApiUrl,
          useValue: apiUrl
        },
        {
          provide: RECAPTCHA_LANGUAGE,
          useValue: 'fr', // use French language
        },
        {
          provide: RECAPTCHA_SETTINGS,
          useValue: { siteKey: '6LcShykUAAAAABdza2v650f5yRyn1dAx944dmL10' } as RecaptchaSettings,
        }, TokenStorage, LoginService, UserService, UserStore]
    };
  }
}
