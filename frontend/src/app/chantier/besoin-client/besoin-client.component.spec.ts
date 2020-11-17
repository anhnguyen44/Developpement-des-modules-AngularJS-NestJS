import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinClientComponent } from './besoin-client.component';

describe('ChantierComponent', () => {
  let component: BesoinClientComponent;
  let fixture: ComponentFixture<BesoinClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
