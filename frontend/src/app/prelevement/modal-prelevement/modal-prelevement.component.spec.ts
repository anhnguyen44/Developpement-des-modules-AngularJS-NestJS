import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrelevementComponent } from './modal-prelevement.component';

describe('ModalPrelevementComponent', () => {
  let component: ModalPrelevementComponent;
  let fixture: ComponentFixture<ModalPrelevementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrelevementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
