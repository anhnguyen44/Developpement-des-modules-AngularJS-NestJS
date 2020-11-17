import { TestBed } from '@angular/core/testing';

import { RessourceHumaineFonctionService } from './rh-fonction.service';

describe('RessourceHumaineFonctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RessourceHumaineFonctionService = TestBed.get(RessourceHumaineFonctionService);
    expect(service).toBeTruthy();
  });
});