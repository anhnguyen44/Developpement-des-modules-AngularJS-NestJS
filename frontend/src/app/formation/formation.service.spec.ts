import { TestBed } from '@angular/core/testing';

import { FormationService } from './formation.service';

describe('InterventionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormationService = TestBed.get(FormationService);
    expect(service).toBeTruthy();
  });
});
