import { Module } from '@nestjs/common';
import { MateriauConstructionAmianteController } from './materiau-construction-amiante.controller';
import { MateriauConstructionAmianteService } from './materiau-construction-amiante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriauConstructionAmiante } from './materiau-construction-amiante.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MateriauConstructionAmiante])
    ],
    controllers: [MateriauConstructionAmianteController],
    providers: [MateriauConstructionAmianteService],
    exports: [MateriauConstructionAmianteService]
})
export class MateriauConstructionAmianteModule { }
