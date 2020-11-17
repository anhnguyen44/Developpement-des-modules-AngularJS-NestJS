import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueInterventionComponent } from './historique-intervention.component';

describe('HistoriqueInterventionComponent', () => {
  let component: HistoriqueInterventionComponent;
  let fixture: ComponentFixture<HistoriqueInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
