import {Module} from '@nestjs/common';
import {TypeGrilleController} from './type-grille.controller';
import {TypeGrilleService} from './type-grille.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeGrille} from './type-grille.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TypeGrille])
    ],
    controllers: [TypeGrilleController],
    providers: [TypeGrilleService],
    exports: [TypeGrilleService],
})
export class TypeGrilleModule {}
