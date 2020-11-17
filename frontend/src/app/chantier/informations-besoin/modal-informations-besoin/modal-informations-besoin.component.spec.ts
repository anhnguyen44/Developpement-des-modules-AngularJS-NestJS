import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInformationsBesoinComponent } from './modal-informations-besoin.component';

describe('ModalInformationsBesoinComponent', () => {
  let component: ModalInformationsBesoinComponent;
  let fixture: ComponentFixture<ModalInformationsBesoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInformationsBesoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInformationsBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
