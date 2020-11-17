import {Module} from '@nestjs/common';
import {FiltreController} from './filtre.controller';
import {FiltreService} from './filtre.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Filtre} from './filtre.entity';
import { Franchise } from '../franchise/franchise.entity';
import { FranchiseService } from '../franchise/franchise.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Filtre, Franchise])
    ],
    controllers: [FiltreController],
    providers: [FiltreService, FranchiseService],
    exports: [FiltreService]
})
export class FiltreModule {}
