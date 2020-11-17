import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationMeteoComponent } from './station-meteo.component';

describe('StationMeteoComponent', () => {
  let component: StationMeteoComponent;
  let fixture: ComponentFixture<StationMeteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationMeteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationMeteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
