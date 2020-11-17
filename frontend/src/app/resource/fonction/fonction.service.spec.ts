import { TestBed } from '@angular/core/testing';

import { FonctionService } from './fonction.service';

describe('FonctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FonctionService = TestBed.get(FonctionService);
    expect(service).toBeTruthy();
  });
});
