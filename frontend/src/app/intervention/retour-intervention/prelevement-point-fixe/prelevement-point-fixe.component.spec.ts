import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrelevementPointFixeComponent } from './prelevement-point-fixe.component';

describe('PrelevementPointFixeComponent', () => {
  let component: PrelevementPointFixeComponent;
  let fixture: ComponentFixture<PrelevementPointFixeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrelevementPointFixeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrelevementPointFixeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
