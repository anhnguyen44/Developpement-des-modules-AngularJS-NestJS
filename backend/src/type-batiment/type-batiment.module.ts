import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { TypeBatimentService } from './type-batiment.service';
import {TypeBatiment} from './type-batiment.entity';
import { TypeBatimentController } from './type-batiment.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([TypeBatiment]), LoggerModule
  ],
    controllers: [
        TypeBatimentController
    ],
  providers: [
    // ...typeBatimentProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    TypeBatimentService
  ],
  exports: [TypeBatimentService]
})
export class TypeBatimentModule {}
