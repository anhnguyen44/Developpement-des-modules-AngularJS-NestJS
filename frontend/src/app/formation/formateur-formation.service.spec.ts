import { TestBed } from '@angular/core/testing';

import { FormateurFormationService } from './formateur-formation.service';

describe('InterventionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormateurFormationService = TestBed.get(FormateurFormationService);
    expect(service).toBeTruthy();
  });
});