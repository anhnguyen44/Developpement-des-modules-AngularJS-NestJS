import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrigineValidationComponent } from './modal-origine-validation.component';

describe('ModalOrigineValidationComponent', () => {
  let component: ModalOrigineValidationComponent;
  let fixture: ComponentFixture<ModalOrigineValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOrigineValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOrigineValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
