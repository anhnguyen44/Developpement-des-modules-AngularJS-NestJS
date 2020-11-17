import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDevisCommandeComponent } from './interlocuteur-devis-commande.component';

describe('InterlocuteurDevisCommandeComponent', () => {
  let component: ContactDevisCommandeComponent;
  let fixture: ComponentFixture<ContactDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
