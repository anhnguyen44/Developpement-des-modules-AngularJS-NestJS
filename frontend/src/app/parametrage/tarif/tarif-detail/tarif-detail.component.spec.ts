import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrilleTarifDetailComponent } from './tarif-detail.component';
import {MenuParametrageComponent} from '../../menu-parametrage/menu-parametrage.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../resource/user/user.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ValidationService} from '../../../resource/validation/validation.service';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {ResourceService} from '../../../resource/resource.service';
import {CiviliteService} from '../../../resource/civilite/civilite.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('GrilleTarifDetailComponent', () => {
  let component: GrilleTarifDetailComponent;
  let fixture: ComponentFixture<GrilleTarifDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ GrilleTarifDetailComponent, MenuParametrageComponent],
      providers: [
          CiviliteService,
          UserService,
          ValidationService,
          ResourceService,
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrilleTarifDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
