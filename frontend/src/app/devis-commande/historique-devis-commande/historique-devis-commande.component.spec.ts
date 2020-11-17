import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDevisCommandeComponent } from './historique-devis-commande.component';

describe('HistoriqueDevisCommandeComponent', () => {
  let component: HistoriqueDevisCommandeComponent;
  let fixture: ComponentFixture<HistoriqueDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
