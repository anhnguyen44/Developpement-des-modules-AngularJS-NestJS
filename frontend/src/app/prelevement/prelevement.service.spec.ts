import { TestBed } from '@angular/core/testing';

import { PrelevementService } from './prelevement.service';

describe('PrelevementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrelevementService = TestBed.get(PrelevementService);
    expect(service).toBeTruthy();
  });
});
