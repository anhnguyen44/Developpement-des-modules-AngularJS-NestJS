import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRetourInterventionComponent } from './page-retour-intervention.component';

describe('PageRetourInterventionComponent', () => {
  let component: PageRetourInterventionComponent;
  let fixture: ComponentFixture<PageRetourInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRetourInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRetourInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
