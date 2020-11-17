import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSalleComponent } from './liste-salle.component';

describe('ListeSalleComponent', () => {
  let component: ListeSalleComponent;
  let fixture: ComponentFixture<ListeSalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeSalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeSalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
