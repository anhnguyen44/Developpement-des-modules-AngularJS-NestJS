import {Module} from '@nestjs/common';
import {RessourceHumaineController} from './ressource-humaine.controller';
import {RessourceHumaineService} from './ressource-humaine.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RessourceHumaine} from './ressource-humaine.entity';
import {RendezVousRessourceHumaine} from './rendez_vous_ressource-humaine.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RessourceHumaine, RendezVousRessourceHumaine])
    ],
    controllers: [RessourceHumaineController],
    providers: [RessourceHumaineService],
    exports: [RessourceHumaineService]
})
export class RessourceHumaineModule {}
