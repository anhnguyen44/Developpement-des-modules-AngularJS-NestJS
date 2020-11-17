import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrelevementMestComponent } from './prelevement-mest.component';

describe('PrelevementMestComponent', () => {
  let component: PrelevementMestComponent;
  let fixture: ComponentFixture<PrelevementMestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrelevementMestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrelevementMestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
