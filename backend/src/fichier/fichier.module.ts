import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Fichier} from './fichier.entity';
import {FichierController} from './fichier.controller';
import {FichierService} from './fichier.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Fichier])
    ],
    controllers: [FichierController],
    providers: [FichierService],
    exports: [FichierService]
})
export class FichierModule {}
