import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProcessusComponent } from './liste-processus.component';

describe('ListeProcessusComponent', () => {
  let component: ListeProcessusComponent;
  let fixture: ComponentFixture<ListeProcessusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeProcessusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
