import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeContactDevisCommandeController} from './type-contact-devis-commande.controller';
import {TypeContactDevisCommandeService} from './type-contact-devis-commande.service';
import {TypeContactDevisCommande} from './type-contact-devis-commande.entity';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([TypeContactDevisCommande])
    ],
    controllers: [TypeContactDevisCommandeController],
    providers: [TypeContactDevisCommandeService],
    exports: [TypeContactDevisCommandeService]
})
export class TypeContactDevisCommandeModule {}
