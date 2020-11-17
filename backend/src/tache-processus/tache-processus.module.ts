import {Module} from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';
import {TacheProcessus} from './tache-processus.entity';
import {TacheProcessusController} from './tache-processus.controller';
import {TacheProcessusService} from './tache-processus.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([TacheProcessus])
    ],
    controllers: [TacheProcessusController],
    providers: [TacheProcessusService],
    exports: [TacheProcessusService]
})
export class TacheProcessusModule {}
