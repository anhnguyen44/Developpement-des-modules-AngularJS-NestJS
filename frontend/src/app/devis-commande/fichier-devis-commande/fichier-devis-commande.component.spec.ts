import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierDevisCommandeComponent } from './fichier-devis-commande.component';

describe('FichierDevisCommandeComponent', () => {
  let component: FichierDevisCommandeComponent;
  let fixture: ComponentFixture<FichierDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichierDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichierDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
