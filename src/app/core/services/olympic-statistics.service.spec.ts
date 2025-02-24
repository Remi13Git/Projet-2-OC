import { TestBed } from '@angular/core/testing';

import { OlympicStatisticsService } from './olympic-statistics.service';

describe('OlympicStatisticsService', () => {
  let service: OlympicStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlympicStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
