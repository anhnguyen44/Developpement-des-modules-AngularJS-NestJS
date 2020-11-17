import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDomaineCompetenceComponent } from './modal-domaine-competence.component';


describe('ModalDomaineCompetenceComponent', () => {
  let component: ModalDomaineCompetenceComponent;
  let fixture: ComponentFixture<ModalDomaineCompetenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDomaineCompetenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDomaineCompetenceComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
