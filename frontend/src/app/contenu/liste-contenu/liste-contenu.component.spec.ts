import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContenuComponent } from './liste-contenu.component';

describe('ListeContenuComponent', () => {
  let component: ListeContenuComponent;
  let fixture: ComponentFixture<ListeContenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeContenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeContenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
