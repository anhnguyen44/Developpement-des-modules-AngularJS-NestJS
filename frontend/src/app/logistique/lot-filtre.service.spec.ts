import { TestBed } from '@angular/core/testing';

import { LotFiltreService } from './lot-filtre.service';

describe('LotFiltreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LotFiltreService = TestBed.get(LotFiltreService);
    expect(service).toBeTruthy();
  });
});
