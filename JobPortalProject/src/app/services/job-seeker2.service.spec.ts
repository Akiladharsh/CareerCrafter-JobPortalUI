import { TestBed } from '@angular/core/testing';

import { JobSeeker2Service } from './job-seeker2.service';

describe('JobSeeker2Service', () => {
  let service: JobSeeker2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSeeker2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
