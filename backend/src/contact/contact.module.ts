import {Module} from '@nestjs/common';
import {ContactController} from './contact.controller';
import {ContactService} from './contact.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Contact} from './contact.entity';
import {Adresse} from '../adresse/adresse.entity';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact, Adresse, CompteContact]),
        GeocodingModule
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService]
})
export class ContactModule {}
