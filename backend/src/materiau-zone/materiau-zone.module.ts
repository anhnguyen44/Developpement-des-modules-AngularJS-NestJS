import { Module } from '@nestjs/common';
import { MateriauZoneController } from './materiau-zone.controller';
import { MateriauZoneService } from './materiau-zone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriauZone } from './materiau-zone.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MateriauZone])
    ],
    controllers: [MateriauZoneController],
    providers: [MateriauZoneService],
    exports: [MateriauZoneService]
})
export class MateriauZoneModule { }
