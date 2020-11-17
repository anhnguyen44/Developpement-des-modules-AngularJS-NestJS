import {Module} from '@nestjs/common';
import {SalleController} from './salle.controller';
import {SalleService} from './salle.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Salle} from './salle.entity';
import {RendezVousSalle} from './rendez_vous_salle.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Salle, RendezVousSalle])
    ],
    controllers: [SalleController],
    providers: [SalleService],
    exports: [SalleService]
})
export class SalleModule {}
