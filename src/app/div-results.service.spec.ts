import { TestBed } from '@angular/core/testing';

import { DivResultsService } from './div-results.service';

describe('DivResultsService', () => {
  let service: DivResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
