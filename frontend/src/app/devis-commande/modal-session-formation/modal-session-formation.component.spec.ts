import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSessionFormationComponent } from './modal-session-formation.component';


describe('ModalSessionFormationComponent', () => {
  let component: ModalSessionFormationComponent;
  let fixture: ComponentFixture<ModalSessionFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSessionFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSessionFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
