import {Module} from '@nestjs/common';
import {NoteCompetenceStagiairetController} from './note-competence-stagiaire.controller';
import {NoteCompetenceStagiaireService} from './note-competence-stagiaire.service';
import {Civilite} from '../civilite/civilite.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CNoteCompetenceStagiaire} from './note-competence-stagiaire.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CNoteCompetenceStagiaire])
    ],
    controllers: [NoteCompetenceStagiairetController],
    providers: [NoteCompetenceStagiaireService],
    exports: [NoteCompetenceStagiaireService],
})
export class NoteCompetenceStagiaireModule {}