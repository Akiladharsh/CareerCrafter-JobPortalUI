import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateJobsComponent } from './employee-create-jobs.component';

describe('EmployeeCreateJobsComponent', () => {
  let component: EmployeeCreateJobsComponent;
  let fixture: ComponentFixture<EmployeeCreateJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCreateJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
