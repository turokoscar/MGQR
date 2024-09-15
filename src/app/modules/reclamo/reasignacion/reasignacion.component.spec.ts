import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignacionComponent } from './reasignacion.component';

describe('ReasignacionComponent', () => {
  let component: ReasignacionComponent;
  let fixture: ComponentFixture<ReasignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasignacionComponent]
    });
    fixture = TestBed.createComponent(ReasignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
