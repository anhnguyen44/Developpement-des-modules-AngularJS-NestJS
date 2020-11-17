import { TestBed } from '@angular/core/testing';

import { DevisCommandeService } from './devis-commande.service';

describe('DevisCommandeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevisCommandeService = TestBed.get(DevisCommandeService);
    expect(service).toBeTruthy();
  });
});
