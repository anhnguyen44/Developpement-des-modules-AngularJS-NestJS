import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BureauSAComponent } from './bureau.component';

describe('BureauSAComponent', () => {
  let component: BureauSAComponent;
  let fixture: ComponentFixture<BureauSAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BureauSAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BureauSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
