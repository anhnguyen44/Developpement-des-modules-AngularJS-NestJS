import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConsommableComponent } from './modal-consommable.component';

describe('ModalConsommableComponent', () => {
  let component: ModalConsommableComponent;
  let fixture: ComponentFixture<ModalConsommableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConsommableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConsommableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
