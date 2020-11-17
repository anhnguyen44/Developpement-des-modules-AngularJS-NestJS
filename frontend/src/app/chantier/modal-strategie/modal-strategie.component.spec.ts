import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStrategieComponent } from './modal-strategie.component';

describe('ModalStrategieComponent', () => {
  let component: ModalStrategieComponent;
  let fixture: ComponentFixture<ModalStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
