import {Module} from '@nestjs/common';

import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import { TFormationDCompetenceController } from './tFormation-dCompetence.controller';
import { TFormationDCompetence } from './tFormation-dCompetence.entity';
import { TFormationDCompetenceService } from './tFormation-dCompetence.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([TFormationDCompetence])
    ],
    controllers: [TFormationDCompetenceController],
    providers: [TFormationDCompetenceService],
    exports: [TFormationDCompetenceService],
})
export class TFormationDCompetenceModule {}
