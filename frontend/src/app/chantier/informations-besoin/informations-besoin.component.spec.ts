import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsBesoinComponent } from './informations-besoin.component';

describe('InformationsBesoinComponent', () => {
  let component: InformationsBesoinComponent;
  let fixture: ComponentFixture<InformationsBesoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationsBesoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationsBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
