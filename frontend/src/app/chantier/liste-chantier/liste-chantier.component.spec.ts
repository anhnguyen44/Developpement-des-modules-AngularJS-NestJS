import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeChantierComponent } from './liste-chantier.component';

describe('ListeDevisComponent', () => {
  let component: ListeChantierComponent;
  let fixture: ComponentFixture<ListeChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
