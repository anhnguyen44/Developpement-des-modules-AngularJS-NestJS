import { Module } from '@nestjs/common';
import { ListeController } from './liste.controller';
import { ListeService } from './liste.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liste } from './liste.entity';
import { FranchiseService } from '../franchise/franchise.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Liste])
    ],
    controllers: [ListeController],
    providers: [ListeService, FranchiseService],
    exports: [ListeService]
})
export class ListeModule { }
