import { TestBed } from '@angular/core/testing';

import { TacheProcessusService } from './tache-processus.service';

describe('TacheProcessusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TacheProcessusService = TestBed.get(TacheProcessusService);
    expect(service).toBeTruthy();
  });
});
