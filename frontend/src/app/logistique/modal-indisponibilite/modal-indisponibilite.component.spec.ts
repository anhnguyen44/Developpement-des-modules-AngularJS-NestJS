import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIndisponibiliteComponent } from './modal-indisponibilite.component';

describe('ModalIndisponibiliteComponent', () => {
  let component: ModalIndisponibiliteComponent;
  let fixture: ComponentFixture<ModalIndisponibiliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIndisponibiliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIndisponibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
