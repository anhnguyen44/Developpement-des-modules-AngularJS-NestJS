import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchantillonnageComponent } from './echantillonnage.component';

describe('EchantillonnageComponent', () => {
  let component: EchantillonnageComponent;
  let fixture: ComponentFixture<EchantillonnageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchantillonnageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchantillonnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
