import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDevisCommandeComponent } from './detail-devis-commande.component';

describe('DetailDevisCommandeComponent', () => {
  let component: DetailDevisCommandeComponent;
  let fixture: ComponentFixture<DetailDevisCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDevisCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDevisCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
