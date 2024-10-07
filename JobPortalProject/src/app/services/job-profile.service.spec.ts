import { TestBed } from '@angular/core/testing';

import { JobProfileService } from './job-profile.service';

describe('JobProfileService', () => {
  let service: JobProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
