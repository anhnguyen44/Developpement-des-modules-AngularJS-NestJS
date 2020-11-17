import { TestBed } from '@angular/core/testing';

import { TypeFichierService } from './type-fichier.service';

describe('TypeFichierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeFichierService = TestBed.get(TypeFichierService);
    expect(service).toBeTruthy();
  });
});
