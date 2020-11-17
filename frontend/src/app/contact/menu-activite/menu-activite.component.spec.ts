import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuActiviteComponent } from './menu-activite-contact.component';
import {ActivatedRoute, Data} from '@angular/router';

describe('MenuActiviteContactComponent', () => {
  let component: MenuActiviteComponent;
  let fixture: ComponentFixture<MenuActiviteComponent>;

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
      declarations: [ MenuActiviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
