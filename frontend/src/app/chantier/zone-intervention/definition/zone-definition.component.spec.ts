import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneInterventionDefinitionComponent } from './zone-definition.component';

import {PaginationComponent} from '../../../resource/query-builder/pagination/pagination.component';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ApiUrl} from '../../../resource/api-url';
import {UserService} from '../../../resource/user/user.service';
import {ValidationService} from '../../../resource/validation/validation.service';
import {ResourceService} from '../../../resource/resource.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MenuParametrageComponent } from '../../../parametrage/menu-parametrage/menu-parametrage.component';

describe('ListeUtilisateur', () => {
  const apiUrl = 'http://localhost:1234/api/v1/';
  let component: ZoneInterventionDefinitionComponent;
  let fixture: ComponentFixture<ZoneInterventionDefinitionComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, HttpClientModule, HttpClientTestingModule],
          declarations: [ ZoneInterventionDefinitionComponent, MenuParametrageComponent, PaginationComponent],
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
              },
              UserService,
              ValidationService,
              ResourceService,
              {
                  provide: Router,
                  useClass: class  {
                      navigate = jasmine.createSpy('navigate');
                  }
              }
          ]
      }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneInterventionDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
