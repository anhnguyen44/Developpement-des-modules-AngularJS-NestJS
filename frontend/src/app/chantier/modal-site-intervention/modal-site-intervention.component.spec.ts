import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSiteInterventionComponent } from './modal-site-intervention.component';

describe('ModalSiteInterventionComponent', () => {
  let component: ModalSiteInterventionComponent;
  let fixture: ComponentFixture<ModalSiteInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSiteInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSiteInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
