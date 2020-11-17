import {Module} from '@nestjs/common';
import {FormationController} from './formation.controller';
import {FormationService} from './formation.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CFormation} from './formation.entity';
import { CFormationContact } from '../formation-contact/formation-contact.entity';
import { FormationContactModule } from '../formation-contact/formation-contact.module';
import { FormationContactService } from '../formation-contact/formation-contact.service';
import { NoteCompetenceStagiaireModule } from '../note-competence-stagiaire/note-competence-stagiaire.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CFormation]),
        FormationContactModule,
        NoteCompetenceStagiaireModule
    ],
    controllers: [FormationController],
    providers: [FormationService],
    exports: [FormationService],
})
export class FormationModule {}