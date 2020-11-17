import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { MomentObjectifService } from './moment-objectif.service';
import {MomentObjectif} from './moment-objectif.entity';
import { MomentObjectifController } from './moment-objectif.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([MomentObjectif]), LoggerModule
  ],
    controllers: [
        MomentObjectifController
    ],
  providers: [
    // ...momentObjectifProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    MomentObjectifService
  ],
  exports: [MomentObjectifService]
})
export class MomentObjectifModule {}
