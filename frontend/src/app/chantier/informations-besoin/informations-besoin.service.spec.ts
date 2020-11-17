import { TestBed } from '@angular/core/testing';

import { FichierService } from './informations-besoin.service';

describe('FichierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FichierService = TestBed.get(FichierService);
    expect(service).toBeTruthy();
  });
});
