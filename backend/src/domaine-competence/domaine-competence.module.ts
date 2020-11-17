import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CDomaineCompetence } from './domaine-competence.entity';
import { DomaineCompetenceController } from './domaine-competence.controller';
import { DomaineCompetenceService } from './domaine-competence.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([CDomaineCompetence])
    ],
    controllers: [DomaineCompetenceController],
    providers: [DomaineCompetenceService],
    exports: [DomaineCompetenceService]
})
export class DomaineCompetenceModule {}
