import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePrelevementZoneComponent } from './page-prelevement-zone.component';

describe('PagePrelevementZoneComponent', () => {
  let component: PagePrelevementZoneComponent;
  let fixture: ComponentFixture<PagePrelevementZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePrelevementZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePrelevementZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
