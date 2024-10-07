import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewApplicationsComponent } from './employee-view-applications.component';

describe('EmployeeViewApplicationsComponent', () => {
  let component: EmployeeViewApplicationsComponent;
  let fixture: ComponentFixture<EmployeeViewApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeViewApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
