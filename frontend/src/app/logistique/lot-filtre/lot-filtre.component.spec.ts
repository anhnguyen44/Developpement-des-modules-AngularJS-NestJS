import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotFiltreComponent } from './filtre.component';

describe('FiltreComponent', () => {
  let component: LotFiltreComponent;
  let fixture: ComponentFixture<LotFiltreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotFiltreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
