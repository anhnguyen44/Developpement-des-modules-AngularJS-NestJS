import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListeContactComponent } from './page-liste-contact.component';

describe('PageListeInterlocuteurComponent', () => {
  let component: PageListeContactComponent;
  let fixture: ComponentFixture<PageListeContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListeContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListeContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
