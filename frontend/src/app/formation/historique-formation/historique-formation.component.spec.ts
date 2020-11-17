import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueFormationComponent } from './historique-formation.component';

describe('HistoriqueFormationComponent', () => {
  let component: HistoriqueFormationComponent;
  let fixture: ComponentFixture<HistoriqueFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
