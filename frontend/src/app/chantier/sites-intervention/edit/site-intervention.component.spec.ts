import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInterventionEditComponent } from './site-intervention.component';

describe('ChantierComponent', () => {
  let component: SiteInterventionEditComponent;
  let fixture: ComponentFixture<SiteInterventionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteInterventionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteInterventionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
