import {Module} from '@nestjs/common';
import {RhFormationValideController} from './rh-formationValide.controller';
import {RhFormationValideService} from './rh-formationValide.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RhFormationValide} from './rh-formationValide.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RhFormationValide])
    ],
    controllers: [RhFormationValideController],
    providers: [RhFormationValideService],
    exports: [RhFormationValideService],
})
export class RhFormationValideModule{}
