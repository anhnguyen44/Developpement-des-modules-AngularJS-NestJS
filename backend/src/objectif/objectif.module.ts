import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { ObjectifService } from './objectif.service';
import {Objectif} from './objectif.entity';
import { ObjectifController } from './objectif.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([Objectif]), LoggerModule
  ],
    controllers: [
        ObjectifController
    ],
  providers: [
    // ...objectifProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    ObjectifService
  ],
  exports: [ObjectifService]
})
export class ObjectifModule {}
