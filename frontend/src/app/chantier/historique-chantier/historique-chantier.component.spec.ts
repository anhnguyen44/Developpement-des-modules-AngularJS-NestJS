import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueChantierComponent } from './historique-chantier.component';

describe('HistoriqueChantierComponent', () => {
  let component: HistoriqueChantierComponent;
  let fixture: ComponentFixture<HistoriqueChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
