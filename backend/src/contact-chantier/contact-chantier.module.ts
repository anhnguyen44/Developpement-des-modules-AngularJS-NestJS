import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PasswordCryptographerServiceImpl} from '../auth/password-cryptographer/password-cryptographer';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../auth/constants';
import {LoggerModule} from '../logger/logger.module';
import { ContactChantierService } from './contact-chantier.service';
import {ContactChantier} from './contact-chantier.entity';
import { ContactChantierController } from './contact-chantier.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([ContactChantier]), LoggerModule
  ],
    controllers: [
        ContactChantierController
    ],
  providers: [
    // ...contactChantierProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    ContactChantierService
  ],
  exports: [ContactChantierService]
})
export class ContactChantierModule {}
