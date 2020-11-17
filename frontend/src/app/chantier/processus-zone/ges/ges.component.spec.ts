import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GesProcessusZoneComponent } from './ges.component';

describe('GesProcessusZoneComponent', () => {
  let component: GesProcessusZoneComponent;
  let fixture: ComponentFixture<GesProcessusZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GesProcessusZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GesProcessusZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
