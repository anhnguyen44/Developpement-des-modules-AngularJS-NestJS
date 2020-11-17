import {Global, Module} from '@nestjs/common';
import {MailController} from './mail.controller';
import {MailService} from './mail.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Mail} from './mail.entity';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        CryptoModule
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
