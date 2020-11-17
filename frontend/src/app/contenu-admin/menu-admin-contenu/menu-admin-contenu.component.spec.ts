import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdminContenuComponent } from './menu-admin-contenu.component';

describe('MenuAdminContenuComponent', () => {
  let component: MenuAdminContenuComponent;
  let fixture: ComponentFixture<MenuAdminContenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAdminContenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAdminContenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
