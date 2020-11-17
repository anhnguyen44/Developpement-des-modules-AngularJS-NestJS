import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitmetreComponent } from './salle.component';

describe('SalleComponent', () => {
  let component: DebitmetreComponent;
  let fixture: ComponentFixture<DebitmetreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitmetreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitmetreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
