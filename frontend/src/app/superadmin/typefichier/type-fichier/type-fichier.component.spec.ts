import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFichierComponent } from './type-fichier.component';

describe('TypeFichierComponent', () => {
  let component: TypeFichierComponent;
  let fixture: ComponentFixture<TypeFichierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeFichierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
