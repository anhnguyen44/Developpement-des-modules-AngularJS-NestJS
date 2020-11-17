import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierStrategieComponent } from './fichier-strategie.component';

describe('FichierStrategieComponent', () => {
  let component: FichierStrategieComponent;
  let fixture: ComponentFixture<FichierStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichierStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichierStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
