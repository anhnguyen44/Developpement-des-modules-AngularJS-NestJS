import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProduitComponent } from './modal-produit.component';

describe('ModalProduitComponent', () => {
  let component: ModalProduitComponent;
  let fixture: ComponentFixture<ModalProduitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProduitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
