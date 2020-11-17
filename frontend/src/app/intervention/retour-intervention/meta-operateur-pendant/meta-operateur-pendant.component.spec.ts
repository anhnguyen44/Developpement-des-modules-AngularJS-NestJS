import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaOperateurPendantComponent } from './meta-operateur-pendant.component';

describe('MetaOperateurPendantComponent', () => {
  let component: MetaOperateurPendantComponent;
  let fixture: ComponentFixture<MetaOperateurPendantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaOperateurPendantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaOperateurPendantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
