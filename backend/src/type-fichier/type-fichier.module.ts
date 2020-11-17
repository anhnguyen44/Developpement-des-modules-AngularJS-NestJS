import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeFichier} from './type-fichier.entity';
import {TypeFichierController} from './type-fichier.controller';
import {TypeFichierService} from './type-fichier.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([TypeFichier])
    ],
    controllers: [TypeFichierController],
    providers: [TypeFichierService],
    exports: [TypeFichierService]
})
export class TypeFichierModule {}
