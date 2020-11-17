import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierZoneComponent } from './fichier-zone.component';

describe('FichierZoneComponent', () => {
  let component: FichierZoneComponent;
  let fixture: ComponentFixture<FichierZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichierZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichierZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
