import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { TypeObjectifService } from './type-objectif.service';
import {TypeObjectif} from './type-objectif.entity';
import { TypeObjectifController } from './type-objectif.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([TypeObjectif]), LoggerModule
  ],
    controllers: [
        TypeObjectifController
    ],
  providers: [
    // ...typeObjectifProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    TypeObjectifService
  ],
  exports: [TypeObjectifService]
})
export class TypeObjectifModule {}
