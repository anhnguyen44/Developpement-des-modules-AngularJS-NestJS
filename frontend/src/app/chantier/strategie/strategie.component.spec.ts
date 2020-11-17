import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategieComponent } from './strategie.component';

describe('ChantierComponent', () => {
  let component: StrategieComponent;
  let fixture: ComponentFixture<StrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
