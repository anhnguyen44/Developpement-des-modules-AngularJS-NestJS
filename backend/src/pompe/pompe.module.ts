import {Module} from '@nestjs/common';
import {PompeController} from './pompe.controller';
import {PompeService} from './pompe.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Pompe} from './pompe.entity';
import {RendezVousPompe} from './rendez_vous_pompe.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pompe, RendezVousPompe])
    ],
    controllers: [PompeController],
    providers: [PompeService],
    exports: [PompeService]
})
export class PompeModule {}
