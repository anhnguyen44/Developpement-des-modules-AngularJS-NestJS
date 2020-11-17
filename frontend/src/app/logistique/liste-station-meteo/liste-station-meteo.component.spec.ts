import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeStationMeteoComponent } from './liste-station-meteo.component';

describe('ListeStationMeteoComponent', () => {
  let component: ListeStationMeteoComponent;
  let fixture: ComponentFixture<ListeStationMeteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeStationMeteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeStationMeteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
