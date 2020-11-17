import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeFichierGroupe } from './type-fichier-groupe.entity';
import { TypeFichierGroupeController } from './type-fichier-groupe.controller';
import { TypeFichierGroupeService } from './type-fichier-groupe.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([TypeFichierGroupe])
    ],
    controllers: [TypeFichierGroupeController],
    providers: [TypeFichierGroupeService],
    exports: [TypeFichierGroupeService]
})
export class TypeFichierGroupeModule { }
