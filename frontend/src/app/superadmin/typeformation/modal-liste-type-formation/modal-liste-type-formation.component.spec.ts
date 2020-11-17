import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListeTypeFormation } from './modal-liste-type-formation.component';

describe('ModalListeTypeFormation', () => {
  let component: ModalListeTypeFormation;
  let fixture: ComponentFixture<ModalListeTypeFormation>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListeTypeFormation ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListeTypeFormation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
