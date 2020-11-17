import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInterventionComponent } from './menu-intervention.component';

describe('MenuInterventionComponent', () => {
  let component: MenuInterventionComponent;
  let fixture: ComponentFixture<MenuInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
