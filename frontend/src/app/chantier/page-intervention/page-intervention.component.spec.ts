import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInterventionComponent } from './page-intervention.component';

describe('PageInterventionComponent', () => {
  let component: PageInterventionComponent;
  let fixture: ComponentFixture<PageInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
