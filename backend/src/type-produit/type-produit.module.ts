import {Module} from '@nestjs/common';
import {TypeProduitController} from './type-produit.controller';
import {TypeProduitService} from './type-produit.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeProduit} from './type-produit.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TypeProduit])
    ],
    controllers: [TypeProduitController],
    providers: [TypeProduitService],
    exports: [TypeProduitService],
})
export class TypeProduitModule {}
