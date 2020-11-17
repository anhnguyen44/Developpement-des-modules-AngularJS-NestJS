import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHorairesZoneComponent } from './modal-horaires.component';

describe('ModalHorairesZoneComponent', () => {
  let component: ModalHorairesZoneComponent;
  let fixture: ComponentFixture<ModalHorairesZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHorairesZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHorairesZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
