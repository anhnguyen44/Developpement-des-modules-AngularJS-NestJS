import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenusComponent } from './contenus.component';

describe('ContenusComponent', () => {
  let component: ContenusComponent;
  let fixture: ComponentFixture<ContenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
