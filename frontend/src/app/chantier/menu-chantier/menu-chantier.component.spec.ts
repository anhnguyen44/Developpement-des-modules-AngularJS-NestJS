import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuChantierComponent } from './menu-chantier.component';

describe('MenuChantierComponent', () => {
  let component: MenuChantierComponent;
  let fixture: ComponentFixture<MenuChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
