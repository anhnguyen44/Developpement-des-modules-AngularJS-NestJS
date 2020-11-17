import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationDevisCommandeComponent } from './information-devis-commande.component';

describe('DevisCommandeComponent', () => {
  let component: InformationDevisCommandeComponent;
  let fixture: ComponentFixture<InformationDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
