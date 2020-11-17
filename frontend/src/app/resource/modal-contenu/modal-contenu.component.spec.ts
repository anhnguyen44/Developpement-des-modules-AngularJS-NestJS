import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContenuComponent } from './modal-contenu.component';

describe('ModalContenuComponent', () => {
  let component: ModalContenuComponent;
  let fixture: ComponentFixture<ModalContenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
