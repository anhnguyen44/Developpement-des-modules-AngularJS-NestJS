import { TestBed } from '@angular/core/testing';

import { RessourceHumaineService } from './ressource-humaine.service';

describe('RessourceHumaineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RessourceHumaineService = TestBed.get(RessourceHumaineService);
    expect(service).toBeTruthy();
  });
});
