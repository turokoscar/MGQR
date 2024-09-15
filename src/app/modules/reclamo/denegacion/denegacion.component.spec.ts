import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenegacionComponent } from './denegacion.component';

describe('DenegacionComponent', () => {
  let component: DenegacionComponent;
  let fixture: ComponentFixture<DenegacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DenegacionComponent]
    });
    fixture = TestBed.createComponent(DenegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
