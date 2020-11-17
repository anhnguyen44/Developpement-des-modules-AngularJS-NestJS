import { TestBed } from '@angular/core/testing';

import { TFormationDCompetenceService } from './tFormation-dCompetence.service';

describe('TFormationDCompetenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TFormationDCompetenceService = TestBed.get(TFormationDCompetenceService);
    expect(service).toBeTruthy();
  });
});