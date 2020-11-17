import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBlancLotFiltreComponent } from './modal-blanc-lot-filtre.component';

describe('ModalBlancLotFiltreComponent', () => {
  let component: ModalBlancLotFiltreComponent;
  let fixture: ComponentFixture<ModalBlancLotFiltreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBlancLotFiltreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBlancLotFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
