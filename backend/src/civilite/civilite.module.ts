import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { CiviliteController } from './civilite.controller';
import { CiviliteService } from './civilite.service';
import {Civilite} from './civilite.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Civilite]), LoggerModule
  ],
    controllers: [
        CiviliteController
    ],
  providers: [
    // ...civiliteProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    CiviliteService
  ],
  exports: [CiviliteService]
})
export class CiviliteModule {}
