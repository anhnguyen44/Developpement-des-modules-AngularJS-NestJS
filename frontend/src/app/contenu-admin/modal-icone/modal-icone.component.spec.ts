import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIconeComponent } from './modal-icone.component';

describe('ModalIconeComponent', () => {
  let component: ModalIconeComponent;
  let fixture: ComponentFixture<ModalIconeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIconeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIconeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
