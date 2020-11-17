import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFichierComponent } from './modal-fichier.component';

describe('ModalFichierComponent', () => {
  let component: ModalFichierComponent;
  let fixture: ComponentFixture<ModalFichierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFichierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
