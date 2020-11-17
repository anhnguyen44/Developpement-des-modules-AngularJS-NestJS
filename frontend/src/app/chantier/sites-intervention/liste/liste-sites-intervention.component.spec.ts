import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSitePrelevementComponent } from './liste-sites-intervention.component';

describe('ListeDevisComponent', () => {
  let component: ListeSitePrelevementComponent;
  let fixture: ComponentFixture<ListeSitePrelevementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeSitePrelevementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeSitePrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
