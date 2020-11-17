import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUtilisateurComponent } from './utilisateur-liste.component';
import {MenuParametrageComponent} from '../../menu-parametrage/menu-parametrage.component';
import {PaginationComponent} from '../../../resource/query-builder/pagination/pagination.component';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {UtilisateurComponent} from '../utilisateur/utilisateur.component';
import {ApiUrl} from '../../../resource/api-url';
import {UserService} from '../../../resource/user/user.service';
import {ValidationService} from '../../../resource/validation/validation.service';
import {ResourceService} from '../../../resource/resource.service';
import {ActivatedRoute, Router} from '@angular/router';

describe('ListeUtilisateur', () => {
  const apiUrl = 'http://localhost:1234/api/v1/';
  let component: ListeUtilisateurComponent;
  let fixture: ComponentFixture<ListeUtilisateurComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, HttpClientModule, HttpClientTestingModule],
          declarations: [ ListeUtilisateurComponent, MenuParametrageComponent, PaginationComponent],
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
    fixture = TestBed.createComponent(ListeUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
