import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSuperadminComponent } from './menu-superadmin.component';
import {ActivatedRoute, Data} from '@angular/router';

describe('MenuSuperadminComponent', () => {
  let component: MenuSuperadminComponent;
  let fixture: ComponentFixture<MenuSuperadminComponent>;

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
      declarations: [ MenuSuperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
