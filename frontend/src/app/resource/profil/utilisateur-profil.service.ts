import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilisateurProfil } from './UtilisateurProfil';
import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Utilisateur, Profil } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class UtilisateurProfilService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createUtilisateurProfil(utilisateurProfil: UtilisateurProfil) {
        return this.http.post(this.apiUrl + '/utilisateur-profil/', utilisateurProfil).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    exists(utilisateurProfil: UtilisateurProfil) {
        return this.http.get<Observable<boolean>>(this.apiUrl + '/utilisateur-profil/exists/'
            + utilisateurProfil.utilisateur.id + '/' + utilisateurProfil.franchise.id + '/' + utilisateurProfil.profil.id).pipe(
                map((resp: any) => resp.data),
                share(), take(1)
            );
    }

    findByUtilisateur(utilisateur: Utilisateur) {
        return this.http.get<Observable<UtilisateurProfil[]>>(this.apiUrl + '/utilisateur-profil/by-user/' + utilisateur.id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    findByProfile(profil: Profil) {
        return this.http.get<Observable<UtilisateurProfil[]>>(this.apiUrl + '/utilisateur-profil/by-profile/' + profil.id).pipe(
            map((resp: any) => resp.data),
            share(), take(1)
        );
    }

    remove(profilUtilisateur: UtilisateurProfil) {
         // console.log(profilUtilisateur);
        return this.http.request('delete', this.apiUrl + '/utilisateur-profil/', { "body": profilUtilisateur });
    }
}
