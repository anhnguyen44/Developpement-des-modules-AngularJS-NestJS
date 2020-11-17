import {HistoriqueService} from './historique.service';
import {ApiUrl} from '../api-url';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Inject, InjectionToken} from '@angular/core';
import {async, fakeAsync, inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ResourceService} from '../resource.service';
import {Historique} from './Historique';

const apiUrl = 'http://localhost:1234/api/v1/';

describe('HistoriqueService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HistoriqueService],
            imports: [HttpClientModule, HttpClientTestingModule]
        });
    });

    it(
        'should be able to create the service',
        inject([HistoriqueService, HttpTestingController], (historiqueService: HistoriqueService) => {
            expect(historiqueService).toBeTruthy();
        })
    );

    it(
        'should be able to get a list of resources',
        inject([HistoriqueService, HttpTestingController], (historiqueService: HistoriqueService) => {

            historiqueService.countByApplication('Base-interlocuteur', 50).subscribe((data) => {
                 // console.log(data);
                expect(data.length).toBe(2);
            });
        })
    );

});
