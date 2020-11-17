import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBureauSAComponent } from './liste-bureau.component';

describe('ListeBureauSAComponent', () => {
  let component: ListeBureauSAComponent;
  let fixture: ComponentFixture<ListeBureauSAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeBureauSAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeBureauSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
