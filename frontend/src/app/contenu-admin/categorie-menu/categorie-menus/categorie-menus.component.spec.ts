import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieMenusComponent } from './categorie-menus.component';

describe('CategorieMenusComponent', () => {
  let component: CategorieMenusComponent;
  let fixture: ComponentFixture<CategorieMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
