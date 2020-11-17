import { TestBed } from '@angular/core/testing';

import { AffectationPrelevementService } from './affectation-prelevement.service';

describe('AffectationPrelevementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffectationPrelevementService = TestBed.get(AffectationPrelevementService);
    expect(service).toBeTruthy();
  });
});
