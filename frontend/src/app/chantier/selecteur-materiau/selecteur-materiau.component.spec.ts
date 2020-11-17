import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteurMateriauZoneComponent } from './selecteur-materiau.component';

describe('SelecteurMateriauZoneComponent', () => {
  let component: SelecteurMateriauZoneComponent;
  let fixture: ComponentFixture<SelecteurMateriauZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecteurMateriauZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecteurMateriauZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
