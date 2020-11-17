import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartInterventionComponent } from './depart-intervention.component';

describe('DepartInterventionComponent', () => {
  let component: DepartInterventionComponent;
  let fixture: ComponentFixture<DepartInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
