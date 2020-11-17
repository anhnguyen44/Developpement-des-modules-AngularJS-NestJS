import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaOperateurApresComponent } from './meta-operateur-apres.component';

describe('MetaOperateurApresComponent', () => {
  let component: MetaOperateurApresComponent;
  let fixture: ComponentFixture<MetaOperateurApresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaOperateurApresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaOperateurApresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
