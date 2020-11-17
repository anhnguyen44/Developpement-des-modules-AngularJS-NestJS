import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierChantierComponent } from './fichier-chantier.component';

describe('FichierChantierComponent', () => {
  let component: FichierChantierComponent;
  let fixture: ComponentFixture<FichierChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichierChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichierChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
