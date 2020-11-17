import {Module} from '@nestjs/common';
import {StatutCommandeController} from './statut-commande.controller';
import {StatutCommandeService} from './statut-commande.service';
import {StatutCommande} from './statut-commande.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Franchise} from '../franchise/franchise.entity';
import {ContactService} from '../contact/contact.service';
import {ContactModule} from '../contact/contact.module';


@Module({
    imports: [
        ContactModule,
        TypeOrmModule.forFeature([StatutCommande, Franchise]),
    ],
    controllers: [StatutCommandeController],
    providers: [StatutCommandeService, ContactService],
    exports: [StatutCommandeService]
})
export class StatutCommandeModule {}