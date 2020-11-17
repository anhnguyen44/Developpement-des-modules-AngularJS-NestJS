import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurSuperAdminComponent } from './utilisateur-super-admin.component';

describe('UtilisateurSuperAdminComponent', () => {
  let component: UtilisateurSuperAdminComponent;
  let fixture: ComponentFixture<UtilisateurSuperAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurSuperAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilisateurSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
