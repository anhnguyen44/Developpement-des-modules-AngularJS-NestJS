import { Module } from '@nestjs/common';
import { InterventionController } from './intervention.controller';
import { InterventionService } from './intervention.service';
import { Intervention } from './intervention.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltreService } from '../filtre/filtre.service';
import { Filtre } from '../filtre/filtre.entity';
import {ChantierService} from '../chantier/chantier.service';
import {Chantier} from '../chantier/chantier.entity';
import {ContactService} from '../contact/contact.service';
import {Contact} from '../contact/contact.entity';
import {StatutCommandeService} from '../statut-commande/statut-commande.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Intervention, Filtre])
    ],
    controllers: [InterventionController],
    providers: [InterventionService, FiltreService],
    exports: [InterventionService, FiltreService]
})
export class InterventionModule {}
