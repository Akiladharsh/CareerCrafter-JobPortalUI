import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrackApplicationsComponent } from './employee-track-applications.component';

describe('EmployeeTrackApplicationsComponent', () => {
  let component: EmployeeTrackApplicationsComponent;
  let fixture: ComponentFixture<EmployeeTrackApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTrackApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTrackApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
