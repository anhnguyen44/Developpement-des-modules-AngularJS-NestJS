import { TestBed } from '@angular/core/testing';

import { FicheExpositionService } from './fiche-exposition.service';

describe('FicheExpositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FicheExpositionService = TestBed.get(FicheExpositionService);
    expect(service).toBeTruthy();
  });
});
