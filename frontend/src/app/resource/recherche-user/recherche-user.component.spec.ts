import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheUtilisateurComponent } from './recherche-user.component';

describe('RechercheUtilisateurComponent', () => {
  let component: RechercheUtilisateurComponent;
  let fixture: ComponentFixture<RechercheUtilisateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheUtilisateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
