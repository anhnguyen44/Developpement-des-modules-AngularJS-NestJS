import {Module} from '@nestjs/common';
import {ConsommableController} from './consommable.controller';
import {ConsommableService} from './consommable.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Consommable} from './consommable.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Consommable])
    ],
    controllers: [ConsommableController],
    providers: [ConsommableService],
    exports: [ConsommableService]
})
export class ConsommableModule {}
