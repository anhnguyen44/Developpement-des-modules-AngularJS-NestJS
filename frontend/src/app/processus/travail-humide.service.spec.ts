import { TestBed } from '@angular/core/testing';

import { TravailHumideService } from './travail-humide.service';

describe('TravailHumideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TravailHumideService = TestBed.get(TravailHumideService);
    expect(service).toBeTruthy();
  });
});
