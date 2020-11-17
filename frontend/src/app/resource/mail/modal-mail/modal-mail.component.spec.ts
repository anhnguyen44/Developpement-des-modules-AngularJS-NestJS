import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMailComponent } from './modal-mail.component';

describe('ModalMailComponent', () => {
  let component: ModalMailComponent;
  let fixture: ComponentFixture<ModalMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
