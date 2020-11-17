import { TestBed } from '@angular/core/testing';

import { StationMeteoService } from './station-meteo.service';

describe('StationMeteoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StationMeteoService = TestBed.get(StationMeteoService);
    expect(service).toBeTruthy();
  });
});
