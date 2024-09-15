import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamoRecepcionDenegadoComponent } from './reclamo-recepcion-denegado.component';

describe('ReclamoRecepcionDenegadoComponent', () => {
  let component: ReclamoRecepcionDenegadoComponent;
  let fixture: ComponentFixture<ReclamoRecepcionDenegadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamoRecepcionDenegadoComponent]
    });
    fixture = TestBed.createComponent(ReclamoRecepcionDenegadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
