import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMateriauZoneComponent } from './liste-materiau-amiante.component';

describe('ListeDevisComponent', () => {
  let component: ListeMateriauZoneComponent;
  let fixture: ComponentFixture<ListeMateriauZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeMateriauZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeMateriauZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
