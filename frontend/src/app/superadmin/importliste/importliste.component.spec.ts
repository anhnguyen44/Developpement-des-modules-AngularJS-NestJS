import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportlisteComponent } from './importliste.component';

describe('ImportlisteComponent', () => {
  let component: ImportlisteComponent;
  let fixture: ComponentFixture<ImportlisteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportlisteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportlisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
