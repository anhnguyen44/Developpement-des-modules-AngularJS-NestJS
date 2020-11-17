import {Module} from '@nestjs/common';
import {RendezVousController} from './rendez-vous.controller';
import {RendezVousService} from './rendez-vous.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RendezVous} from './rendez-vous.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RendezVous])
    ],
    controllers: [RendezVousController],
    providers: [RendezVousService],
    exports: [RendezVousService]
})
export class RendezVousModule {}
