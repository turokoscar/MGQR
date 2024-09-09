import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarAdminComponent } from './topbar-admin.component';

describe('TopbarAdminComponent', () => {
  let component: TopbarAdminComponent;
  let fixture: ComponentFixture<TopbarAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarAdminComponent]
    });
    fixture = TestBed.createComponent(TopbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
