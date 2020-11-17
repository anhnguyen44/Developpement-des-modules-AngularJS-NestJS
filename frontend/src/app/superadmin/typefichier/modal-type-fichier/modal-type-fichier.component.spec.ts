import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTypeFichierComponent } from './modal-type-fichier.component';

describe('ModalTypeFichierComponent', () => {
  let component: ModalTypeFichierComponent;
  let fixture: ComponentFixture<ModalTypeFichierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTypeFichierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTypeFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
