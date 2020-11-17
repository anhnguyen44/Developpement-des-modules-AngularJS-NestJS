import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAbandonCommandeComponent } from './modal-abandon.component';

describe('ModalAbandonCommandeComponent', () => {
  let component: ModalAbandonCommandeComponent;
  let fixture: ComponentFixture<ModalAbandonCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAbandonCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAbandonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
