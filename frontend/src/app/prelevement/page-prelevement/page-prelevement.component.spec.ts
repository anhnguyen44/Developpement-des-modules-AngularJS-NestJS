import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePrelevementComponent } from './page-prelevement.component';

describe('PagePrelevementComponent', () => {
  let component: PagePrelevementComponent;
  let fixture: ComponentFixture<PagePrelevementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePrelevementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
