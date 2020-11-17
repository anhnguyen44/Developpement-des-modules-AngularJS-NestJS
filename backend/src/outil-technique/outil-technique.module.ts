import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OutilTechnique} from './outil-technique.entity';
import {OutilTechniqueController} from './outil-technique.controller';
import {OutilTechniqueService} from './outil-technique.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([OutilTechnique])
    ],
    controllers: [OutilTechniqueController],
    providers: [OutilTechniqueService],
    exports: [OutilTechniqueService]
})
export class OutilTechniqueModule {}
