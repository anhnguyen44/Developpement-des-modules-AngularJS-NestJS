import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPompeComponent } from './modal-pompe.component';

describe('ModalPompeComponent', () => {
  let component: ModalPompeComponent;
  let fixture: ComponentFixture<ModalPompeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPompeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPompeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
