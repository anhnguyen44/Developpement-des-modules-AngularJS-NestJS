import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenerationComponent } from './modal-generation.component';

describe('ModalIconeComponent', () => {
  let component: ModalGenerationComponent;
  let fixture: ComponentFixture<ModalGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});