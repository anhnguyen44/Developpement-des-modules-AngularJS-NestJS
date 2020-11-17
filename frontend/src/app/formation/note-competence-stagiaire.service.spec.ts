import { TestBed } from '@angular/core/testing';

import { NoteCompetenceStagiaireService } from './note-competence-stagiaire.service';

describe('NoteCompetenceStagiaireService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoteCompetenceStagiaireService = TestBed.get(NoteCompetenceStagiaireService);
    expect(service).toBeTruthy();
  });
});