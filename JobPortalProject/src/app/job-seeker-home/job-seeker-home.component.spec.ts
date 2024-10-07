import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerHomeComponent } from './job-seeker-home.component';

describe('JobSeekerHomeComponent', () => {
  let component: JobSeekerHomeComponent;
  let fixture: ComponentFixture<JobSeekerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
