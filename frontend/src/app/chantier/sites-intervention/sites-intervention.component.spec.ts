import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInterventionComponent } from './sites-intervention.component';

describe('ChantierComponent', () => {
  let component: SiteInterventionComponent;
  let fixture: ComponentFixture<SiteInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
