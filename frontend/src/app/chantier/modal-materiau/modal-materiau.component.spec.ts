import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMateriauZoneComponent } from './modal-materiau.component';

describe('ModalMateriauZoneComponent', () => {
  let component: ModalMateriauZoneComponent;
  let fixture: ComponentFixture<ModalMateriauZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMateriauZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMateriauZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
