import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { BatimentController } from './batiment.controller';
import { BatimentService } from './batiment.service';
import {Batiment} from './batiment.entity';
import { SitePrelevementService } from '../site-prelevement/site-prelevement.service';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { Adresse } from '../adresse/adresse.entity';
import { FichierService } from '../fichier/fichier.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Batiment, SitePrelevement, Adresse]), LoggerModule
  ],
    controllers: [
        BatimentController
    ],
  providers: [
    // ...batimentProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    BatimentService,
    SitePrelevementService,
    FichierService,
  ],
  exports: [BatimentService]
})
export class BatimentModule {}
