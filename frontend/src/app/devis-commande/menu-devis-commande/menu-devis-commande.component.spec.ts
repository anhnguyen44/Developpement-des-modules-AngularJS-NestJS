import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDevisCommandeComponent } from './menu-devis-commande.component';

describe('MenuDevisCommandeComponent', () => {
  let component: MenuDevisCommandeComponent;
  let fixture: ComponentFixture<MenuDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
