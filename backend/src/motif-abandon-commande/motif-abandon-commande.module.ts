import {Module} from '@nestjs/common';
import {MotifAbandonCommandeController} from './motif-abandon-commande.controller';
import {MotifAbandonCommandeService} from './motif-abandon-commande.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MotifAbandonCommande} from './motif-abandon-commande.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MotifAbandonCommande])
    ],
    controllers: [MotifAbandonCommandeController],
    providers: [MotifAbandonCommandeService],
    exports: [MotifAbandonCommandeService],
})
export class MotifAbandonCommandeModule {}
