import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLogistiqueComponent } from './menu-logistique.component';

describe('MenuLogistiqueComponent', () => {
  let component: MenuLogistiqueComponent;
  let fixture: ComponentFixture<MenuLogistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLogistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLogistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
