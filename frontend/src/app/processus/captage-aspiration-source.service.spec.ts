import { TestBed } from '@angular/core/testing';

import { CaptageAspirationSourceService } from './captage-aspiration-source.service';

describe('CaptageAspirationSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaptageAspirationSourceService = TestBed.get(CaptageAspirationSourceService);
    expect(service).toBeTruthy();
  });
});
