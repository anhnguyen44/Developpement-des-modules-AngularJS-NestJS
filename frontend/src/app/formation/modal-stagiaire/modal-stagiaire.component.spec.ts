import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStagiaireComponent } from './modal-stagiaire.component';

describe('ModalStagiaireComponent', () => {
  let component: ModalStagiaireComponent;
  let fixture: ComponentFixture<ModalStagiaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStagiaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});