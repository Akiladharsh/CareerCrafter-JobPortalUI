import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMyProfileComponent } from './employee-my-profile.component';

describe('EmployeeMyProfileComponent', () => {
  let component: EmployeeMyProfileComponent;
  let fixture: ComponentFixture<EmployeeMyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMyProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
