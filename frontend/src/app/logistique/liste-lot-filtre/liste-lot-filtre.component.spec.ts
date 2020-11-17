import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeLotFiltreComponent } from './liste-lot-filtre.component';

describe('ListeFiltreComponent', () => {
  let component: ListeLotFiltreComponent;
  let fixture: ComponentFixture<ListeLotFiltreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeLotFiltreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeLotFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
