import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomaineCompetenceComponent } from './domaine-competence.component';


describe('DomaineCompetenceComponent', () => {
  let component: DomaineCompetenceComponent;
  let fixture: ComponentFixture<DomaineCompetenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomaineCompetenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomaineCompetenceComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
