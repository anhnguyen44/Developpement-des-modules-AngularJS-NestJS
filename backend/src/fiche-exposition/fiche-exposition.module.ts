import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodingModule } from '../geocoding/geocoding.module';
import {FicheExposition} from './fiche-exposition.entity';
import {FicheExpositionController} from './fiche-exposition.controller';
import {FicheExpositionService} from './fiche-exposition.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FicheExposition]),
        GeocodingModule
    ],
    controllers: [FicheExpositionController],
    providers: [FicheExpositionService],
    exports: [FicheExpositionService]
})
export class FicheExpositionModule { }
