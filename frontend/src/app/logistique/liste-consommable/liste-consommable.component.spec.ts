import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeConsommableComponent } from './liste-consommable.component';

describe('ListeConsommableComponent', () => {
  let component: ListeConsommableComponent;
  let fixture: ComponentFixture<ListeConsommableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeConsommableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeConsommableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
