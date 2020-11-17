import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContactComponent } from './liste-contact.component';

describe('ListeInterlocuteurComponent', () => {
  let component: ListeContactComponent;
  let fixture: ComponentFixture<ListeContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
