import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { TypeContactChantierService } from './type-contact-chantier.service';
import {TypeContactChantier} from './type-contact-chantier.entity';
import { TypeContactChantierController } from './type-contact-chantier.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([TypeContactChantier]), LoggerModule
  ],
    controllers: [
        TypeContactChantierController
    ],
  providers: [
    // ...typeContactChantierProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    TypeContactChantierService
  ],
  exports: [TypeContactChantierService]
})
export class TypeContactChantierModule {}
