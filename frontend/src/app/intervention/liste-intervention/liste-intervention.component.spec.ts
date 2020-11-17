import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInterventionComponent } from './liste-intervention.component';

describe('ListeInterventionComponent', () => {
  let component: ListeInterventionComponent;
  let fixture: ComponentFixture<ListeInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
