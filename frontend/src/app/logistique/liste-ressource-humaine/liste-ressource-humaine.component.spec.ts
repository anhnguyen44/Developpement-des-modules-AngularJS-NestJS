import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRessourceHumaineComponent } from './liste-ressource-humaine.component';

describe('ListeRessourceHumaineComponent', () => {
  let component: ListeRessourceHumaineComponent;
  let fixture: ComponentFixture<ListeRessourceHumaineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeRessourceHumaineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeRessourceHumaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
