import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProcessusZoneComponent } from './liste-processus-zone.component';

describe('ListeDevisComponent', () => {
  let component: ListeProcessusZoneComponent;
  let fixture: ComponentFixture<ListeProcessusZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeProcessusZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeProcessusZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
