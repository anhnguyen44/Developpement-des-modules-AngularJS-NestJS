import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationChantierComponent } from './information-chantier.component';

describe('ChantierComponent', () => {
  let component: InformationChantierComponent;
  let fixture: ComponentFixture<InformationChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
