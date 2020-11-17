import { TestBed } from '@angular/core/testing';

import { TypeContactDevisCommandeService } from './type-contact-devis-commande.service';

describe('TypeContactDevisCommandeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeContactDevisCommandeService = TestBed.get(TypeContactDevisCommandeService);
    expect(service).toBeTruthy();
  });
});
