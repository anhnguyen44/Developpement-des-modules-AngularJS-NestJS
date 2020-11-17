import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RendezVous} from './RendezVous';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  apiUrl: string = environment.api + '/rendez-vous';

  constructor(private http: HttpClient) { }

  delete(rendezVous: RendezVous) {
    return this.http.delete(this.apiUrl + '/' + rendezVous.id);
  }
}
