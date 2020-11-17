import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBatimentComponent } from './modal-batiment.component';

describe('ModalBatimentComponent', () => {
  let component: ModalBatimentComponent;
  let fixture: ComponentFixture<ModalBatimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBatimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBatimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
