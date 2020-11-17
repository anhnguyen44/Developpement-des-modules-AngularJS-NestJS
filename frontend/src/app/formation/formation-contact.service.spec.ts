import { TestBed } from '@angular/core/testing';

import { FormationContactService } from './formation-contact.service';

describe('InterventionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormationContactService = TestBed.get(FormationContactService);
    expect(service).toBeTruthy();
  });
});