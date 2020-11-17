import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePompeComponent } from './liste-pompe.component';

describe('ListePompeComponent', () => {
  let component: ListePompeComponent;
  let fixture: ComponentFixture<ListePompeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePompeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePompeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
