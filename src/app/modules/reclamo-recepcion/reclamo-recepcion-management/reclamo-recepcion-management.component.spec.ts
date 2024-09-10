import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamoRecepcionManagementComponent } from './reclamo-recepcion-management.component';

describe('ReclamoRecepcionManagementComponent', () => {
  let component: ReclamoRecepcionManagementComponent;
  let fixture: ComponentFixture<ReclamoRecepcionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamoRecepcionManagementComponent]
    });
    fixture = TestBed.createComponent(ReclamoRecepcionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
