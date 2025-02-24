import { TestBed } from '@angular/core/testing';

import { OlympicDetailService } from './olympic-detail.service';

describe('OlympicDetailService', () => {
  let service: OlympicDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlympicDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});