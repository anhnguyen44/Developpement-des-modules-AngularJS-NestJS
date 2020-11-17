import { TestBed } from '@angular/core/testing';

import { MpcaService } from './mpca.service';

describe('MpcaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MpcaService = TestBed.get(MpcaService);
    expect(service).toBeTruthy();
  });
});
