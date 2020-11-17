import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProcessusComponent } from './page-processus.component';

describe('PageProcessusComponent', () => {
  let component: PageProcessusComponent;
  let fixture: ComponentFixture<PageProcessusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageProcessusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
