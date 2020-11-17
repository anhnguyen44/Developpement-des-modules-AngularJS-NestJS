import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePrelevementComponent } from './liste-prelevement.component';

describe('ListePrelevementComponent', () => {
  let component: ListePrelevementComponent;
  let fixture: ComponentFixture<ListePrelevementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePrelevementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
