import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuParametrageComponent } from './menu-parametrage.component';
import {ActivatedRoute, Data} from '@angular/router';

describe('MenuParametrageComponent', () => {
  let component: MenuParametrageComponent;
  let fixture: ComponentFixture<MenuParametrageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
          {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    url: [
                        {
                            path: 'utilisateur',
                        }
                    ],
                },
            }
          }
      ]
          ,
      declarations: [ MenuParametrageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuParametrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
