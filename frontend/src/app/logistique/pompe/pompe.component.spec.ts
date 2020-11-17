import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompeComponent } from './pompe.component';

describe('PompeComponent', () => {
  let component: PompeComponent;
  let fixture: ComponentFixture<PompeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
