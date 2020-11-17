import {Module} from '@nestjs/common';
import {MenuDefiniController} from './menu-defini.controller';
import {MenuDefiniService} from './menu-defini.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CMenuDefini} from './menu-defini.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CMenuDefini])
    ],
    controllers: [MenuDefiniController],
    providers: [MenuDefiniService],
    exports: [MenuDefiniService],
})
export class MenuDefiniModule {}
