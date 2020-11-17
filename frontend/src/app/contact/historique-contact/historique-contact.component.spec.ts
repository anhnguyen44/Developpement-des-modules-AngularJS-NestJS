import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueContactComponent } from './historique-contact.component';

describe('HistoriqueContactComponent', () => {
  let component: HistoriqueContactComponent;
  let fixture: ComponentFixture<HistoriqueContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
