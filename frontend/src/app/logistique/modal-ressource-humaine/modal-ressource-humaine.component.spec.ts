import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRessourceHumaineComponent } from './modal-ressource-humaine.component';

describe('ModalRessourceHumaineComponent', () => {
  let component: ModalRessourceHumaineComponent;
  let fixture: ComponentFixture<ModalRessourceHumaineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRessourceHumaineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRessourceHumaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
