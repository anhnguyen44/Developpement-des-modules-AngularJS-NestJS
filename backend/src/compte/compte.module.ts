import {Module} from '@nestjs/common';
import {CompteController} from './compte.controller';
import {CompteService} from './compte.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Adresse} from '../adresse/adresse.entity';
import {Compte} from './compte.entity';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import {Contact} from '../contact/contact.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Compte, Adresse, CompteContact, Contact]),
        GeocodingModule
    ],
    controllers: [CompteController],
    providers: [CompteService],
    exports: [CompteService]
})
export class CompteModule {}
