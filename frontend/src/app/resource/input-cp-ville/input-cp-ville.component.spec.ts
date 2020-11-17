import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCpVilleComponent } from './input-cp-ville.component';

describe('MenuInterlocuteurComponent', () => {
  let component: InputCpVilleComponent;
  let fixture: ComponentFixture<InputCpVilleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCpVilleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCpVilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
