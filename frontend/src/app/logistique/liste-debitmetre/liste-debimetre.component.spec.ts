import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDebimetreComponent } from './liste-salle.component';

describe('ListeSalleComponent', () => {
  let component: ListeDebimetreComponent;
  let fixture: ComponentFixture<ListeDebimetreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeDebimetreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDebimetreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
