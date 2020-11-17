import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeActiviteComponent } from './liste-activite.component';

describe('ListeActiviteComponent', () => {
  let component: ListeActiviteComponent;
  let fixture: ComponentFixture<ListeActiviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeActiviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
