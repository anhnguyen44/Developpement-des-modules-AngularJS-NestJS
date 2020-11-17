import {Module} from '@nestjs/common';
import {RhFonctionController} from './rh-fonction.controller';
import {RhFonctionService} from './rh-fonction.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RhFonction} from './rh-fonction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RhFonction])
    ],
    controllers: [RhFonctionController],
    providers: [RhFonctionService],
    exports: [RhFonctionService],
})
export class RhFonctionModule {}
