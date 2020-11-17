import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisChantierComponent } from './devis.component';

describe('ChantierComponent', () => {
  let component: DevisChantierComponent;
  let fixture: ComponentFixture<DevisChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevisChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevisChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
