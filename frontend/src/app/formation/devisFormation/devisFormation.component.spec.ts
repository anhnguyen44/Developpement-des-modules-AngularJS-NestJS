import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DevisFormationComponent } from './devisFormation.component';




describe('DevisFormationComponent', () => {
  let component: DevisFormationComponent;
  let fixture: ComponentFixture<DevisFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevisFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevisFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});