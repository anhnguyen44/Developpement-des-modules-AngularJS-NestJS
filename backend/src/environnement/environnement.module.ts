import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { LoggerModule } from '../logger/logger.module';
import { EnvironnementService } from './environnement.service';
import { Environnement } from './environnement.entity';
import { EnvironnementController } from './environnement.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Environnement]), LoggerModule
  ],
  controllers: [
    EnvironnementController
  ],
  providers: [
    // ...environnementProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    EnvironnementService
  ],
  exports: [EnvironnementService]
})
export class EnvironnementModule { }
