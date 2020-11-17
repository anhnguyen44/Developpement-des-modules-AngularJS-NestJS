import { Module } from '@nestjs/common';
import { ActiviteController } from './activite.controller';
import { ActiviteService } from './activite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activite } from './activite.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { Adresse } from '../adresse/adresse.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Activite, CompteContact, Adresse]),
        GeocodingModule
    ],
    controllers: [ActiviteController],
    providers: [ActiviteService],
    exports: [ActiviteService]
})
export class ActiviteModule { }
