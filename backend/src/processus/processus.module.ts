import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Processus} from './processus.entity';
import {ProcessusController} from './processus.controller';
import {ProcessusService} from './processus.service';
import { ProcessusZoneService } from '../processus-zone/processus-zone.service';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Processus, ProcessusZone])
    ],
    controllers: [ProcessusController],
    providers: [ProcessusService, ProcessusZoneService],
    exports: [ProcessusService]
})
export class ProcessusModule {}
