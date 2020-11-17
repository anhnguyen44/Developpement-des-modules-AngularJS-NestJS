import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueComponent } from './historique.component';
import {PaginationComponent} from '../query-builder/pagination/pagination.component';
import {HistoriqueService} from './historique.service';
import {ApiUrl} from '../api-url-injection-token';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('HistoriqueComponent', () => {
  let component: HistoriqueComponent;
  let fixture: ComponentFixture<HistoriqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        providers: [HistoriqueService],
        declarations: [ HistoriqueComponent, PaginationComponent],
        imports: [HttpClientModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
