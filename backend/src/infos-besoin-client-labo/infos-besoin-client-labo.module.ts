import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { InfosBesoinClientLaboController } from './infos-besoin-client-labo.controller';
import { InfosBesoinClientLaboService } from './infos-besoin-client-labo.service';
import {InfosBesoinClientLabo} from './infos-besoin-client-labo.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([InfosBesoinClientLabo]), LoggerModule
  ],
    controllers: [
        InfosBesoinClientLaboController
    ],
  providers: [
    // ...besoinClientLaboProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    InfosBesoinClientLaboService
  ],
  exports: [InfosBesoinClientLaboService]
})
export class InfosBesoinClientLaboModule {}
