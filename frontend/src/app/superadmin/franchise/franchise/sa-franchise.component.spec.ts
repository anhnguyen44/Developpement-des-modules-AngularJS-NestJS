import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SAFranchiseComponent } from './sa-franchise.component';

describe('SAFranchiseComponent', () => {
  let component: SAFranchiseComponent;
  let fixture: ComponentFixture<SAFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SAFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SAFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
