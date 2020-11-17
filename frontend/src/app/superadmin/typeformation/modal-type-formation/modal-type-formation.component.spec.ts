import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTypeFormationComponent } from './modal-type-formation.component';

describe('ModalTypeFormationComponent', () => {
  let component: ModalTypeFormationComponent;
  let fixture: ComponentFixture<ModalTypeFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTypeFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTypeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
