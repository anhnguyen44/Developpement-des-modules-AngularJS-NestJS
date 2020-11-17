import {Module} from '@nestjs/common';
import {FormateurFormationController} from './formateur-formation.controller';
import { FormateurFormationService} from './formateur-formation.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FormateurFormation} from './formateur-formation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FormateurFormation])
    ],
    controllers: [FormateurFormationController],
    providers: [FormateurFormationService],
    exports: [FormateurFormationService],
})
export class FormateurFormationModule {}
