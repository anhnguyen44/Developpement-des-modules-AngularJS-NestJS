import { TestBed } from '@angular/core/testing';

import { RessourceHumaineFormationService } from './rh-formation.service';

describe('RessourceHumaineFormationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RessourceHumaineFormationService = TestBed.get(RessourceHumaineFormationService);
    expect(service).toBeTruthy();
  });
});