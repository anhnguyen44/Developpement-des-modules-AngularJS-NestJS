import { TestBed } from '@angular/core/testing';

import { ConsommableService } from './consommable.service';

describe('ConsommableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsommableService = TestBed.get(ConsommableService);
    expect(service).toBeTruthy();
  });
});
