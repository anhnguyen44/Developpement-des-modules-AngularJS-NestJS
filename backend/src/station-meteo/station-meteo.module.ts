import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {StationMeteoService} from './station-meteo.service';
import {StationMeteoController} from './station-meteo.controller';
import {StationMeteo} from './station-meteo.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StationMeteo])
    ],
    controllers: [StationMeteoController],
    providers: [StationMeteoService],
    exports: [StationMeteoService]
})
export class StationMeteoModule {}
