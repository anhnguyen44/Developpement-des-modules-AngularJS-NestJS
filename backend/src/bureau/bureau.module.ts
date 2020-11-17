import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Bureau } from './bureau.entity';
import { BureauController } from './bureau.controller';
import { BureauService } from './bureau.service';
import { Adresse } from '../adresse/adresse.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bureau, Adresse]),
        GeocodingModule
    ],
    controllers: [BureauController],
    providers: [BureauService],
    exports: [BureauService]
})
export class BureauModule { }
