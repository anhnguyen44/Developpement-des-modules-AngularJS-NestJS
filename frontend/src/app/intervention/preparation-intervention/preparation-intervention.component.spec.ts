import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationInterventionComponent } from './preparation-intervention.component';

describe('PreparationInterventionComponent', () => {
  let component: PreparationInterventionComponent;
  let fixture: ComponentFixture<PreparationInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
