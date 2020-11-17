import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeStagiaireFormationComponent } from './liste-stagiaire-formation.component';

describe('MenuFormationComponent', () => {
  let component: ListeStagiaireFormationComponent;
  let fixture: ComponentFixture<ListeStagiaireFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeStagiaireFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeStagiaireFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
