import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueTarifComponent } from './historique-tarif.component';

describe('HistoriqueTarifComponent', () => {
  let component: HistoriqueTarifComponent;
  let fixture: ComponentFixture<HistoriqueTarifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueTarifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
