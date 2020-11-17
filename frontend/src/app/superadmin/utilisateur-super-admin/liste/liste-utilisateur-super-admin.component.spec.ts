import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUtilisateurSuperAdminComponent } from './liste-utilisateur-super-admin.component';

describe('ListeUtilisateurSuperAdminComponent', () => {
  let component: ListeUtilisateurSuperAdminComponent;
  let fixture: ComponentFixture<ListeUtilisateurSuperAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeUtilisateurSuperAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeUtilisateurSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
