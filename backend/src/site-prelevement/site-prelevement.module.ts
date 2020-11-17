import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { SitePrelevementService } from './site-prelevement.service';
import {SitePrelevement} from './site-prelevement.entity';
import { SitePrelevementController } from './site-prelevement.controller';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Adresse } from '../adresse/adresse.entity';
import { Batiment } from '../batiment/batiment.entity';
import { BatimentService } from '../batiment/batiment.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([SitePrelevement, Adresse, Batiment]), LoggerModule,
      GeocodingModule
  ],
    controllers: [
        SitePrelevementController
    ],
  providers: [
    // ...sitePrelevementProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    SitePrelevementService,
    BatimentService,
  ],
  exports: [SitePrelevementService]
})
export class SitePrelevementModule {}
