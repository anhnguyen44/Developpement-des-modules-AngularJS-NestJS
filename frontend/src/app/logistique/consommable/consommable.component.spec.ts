import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsommableComponent } from './consommable.component';

describe('ConsommableComponent', () => {
  let component: ConsommableComponent;
  let fixture: ComponentFixture<ConsommableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsommableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsommableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
