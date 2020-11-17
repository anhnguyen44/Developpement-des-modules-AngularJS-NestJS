import {Module} from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';
import {Fonction} from './fonction.entity';
import {FonctionController} from './fonction.controller';
import {FonctionService} from './fonction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Fonction])
    ],
    controllers: [FonctionController],
    providers: [FonctionService],
    exports: [FonctionService]
})
export class FonctionModule {}
