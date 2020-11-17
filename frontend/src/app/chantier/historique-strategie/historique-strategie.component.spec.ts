import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueStrategieComponent } from './historique-strategie.component';

describe('HistoriqueStrategieComponent', () => {
  let component: HistoriqueStrategieComponent;
  let fixture: ComponentFixture<HistoriqueStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
