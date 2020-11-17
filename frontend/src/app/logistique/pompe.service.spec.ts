import { TestBed } from '@angular/core/testing';

import { PompeService } from './pompe.service';

describe('PompeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PompeService = TestBed.get(PompeService);
    expect(service).toBeTruthy();
  });
});
