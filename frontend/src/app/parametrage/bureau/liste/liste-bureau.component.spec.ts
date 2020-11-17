import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBureauComponent } from './liste-bureau.component';

describe('ListeBureauComponent', () => {
  let component: ListeBureauComponent;
  let fixture: ComponentFixture<ListeBureauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeBureauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
