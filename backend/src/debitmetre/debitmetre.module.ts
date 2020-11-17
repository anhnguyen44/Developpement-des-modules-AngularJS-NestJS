import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Debitmetre} from './debitmetre.entity';
import {DebitmetreController} from './debitmetre.controller';
import {DebitmetreService} from './debitmetre.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Debitmetre])
    ],
    controllers: [DebitmetreController],
    providers: [DebitmetreService],
    exports: [DebitmetreService]
})
export class DebitmetreModule {}
