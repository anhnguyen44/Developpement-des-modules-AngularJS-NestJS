import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordCryptographerServiceImpl } from '../auth/password-cryptographer/password-cryptographer';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { LoggerModule } from '../logger/logger.module';
import { HorairesOccupationLocauxService } from './horaires-occupation.service';
import { HorairesOccupationLocaux } from './horaires-occupation.entity';
import { HorairesOccupationLocauxController } from './horaires-occupation.controller';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Adresse } from '../adresse/adresse.entity';
import { Batiment } from '../batiment/batiment.entity';
import { BatimentService } from '../batiment/batiment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorairesOccupationLocaux, Adresse, Batiment]), LoggerModule,
    GeocodingModule
  ],
  controllers: [
    HorairesOccupationLocauxController
  ],
  providers: [
    // ...horairesOccupationLocauxProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    HorairesOccupationLocauxService,
    BatimentService,
  ],
  exports: [HorairesOccupationLocauxService]
})
export class HorairesOccupationLocauxModule { }
