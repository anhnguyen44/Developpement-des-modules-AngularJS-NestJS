import {Module} from '@nestjs/common';
import {LotFiltreController} from './lot-filtre.controller';
import {LotFiltreService} from './lot-filtre.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LotFiltre} from './lot-filtre.entity';
import {Filtre} from '../filtre/filtre.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([LotFiltre, Filtre])
    ],
    controllers: [LotFiltreController],
    providers: [LotFiltreService],
    exports: [LotFiltreService]
})
export class LotFiltreModule {}
