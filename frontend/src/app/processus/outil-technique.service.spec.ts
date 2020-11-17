import { TestBed } from '@angular/core/testing';

import { OutilTechniqueService } from './outil-technique.service';

describe('OutilTechniqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutilTechniqueService = TestBed.get(OutilTechniqueService);
    expect(service).toBeTruthy();
  });
});
