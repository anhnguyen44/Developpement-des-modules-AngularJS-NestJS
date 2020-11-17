import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaOperateurAvantComponent } from './meta-operateur-avant.component';

describe('MetaOperateurAvantComponent', () => {
  let component: MetaOperateurAvantComponent;
  let fixture: ComponentFixture<MetaOperateurAvantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaOperateurAvantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaOperateurAvantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
