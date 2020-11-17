import { TestBed } from '@angular/core/testing';

import { ProcessusService } from './processus.service';

describe('ProcessusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessusService = TestBed.get(ProcessusService);
    expect(service).toBeTruthy();
  });
});
