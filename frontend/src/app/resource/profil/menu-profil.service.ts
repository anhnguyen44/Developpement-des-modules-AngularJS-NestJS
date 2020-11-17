import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuProfil } from './MenuProfil';
import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MenuDefini, Profil } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class MenuProfilService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createMenuProfil(menuProfil: MenuProfil) {
        return this.http.post(this.apiUrl + '/menu-profil/', menuProfil).pipe(
            map((resp: any) => resp.data)
        );
    }

    remove(menuProfil: MenuProfil){
        return this.http.request('delete', this.apiUrl + '/menu-profil/',{ "body": menuProfil });
    }

    // exists(utilisateurProfil: UtilisateurProfil) {
    //     return this.http.get<Observable<boolean>>(this.apiUrl + '/utilisateur-profil/exists/'
    //         + utilisateurProfil.utilisateur.id + '/' + utilisateurProfil.franchise.id + '/' + utilisateurProfil.profil.id).pipe(
    //             map((resp: any) => resp.data)
    //         );
    // }

    // findByUtilisateur(utilisateur: Utilisateur) {
    //     return this.http.get<Observable<UtilisateurProfil[]>>(this.apiUrl + '/utilisateur-profil/by-user/' + utilisateur.id).pipe(
    //         map((resp: any) => resp.data)
    //     );
    // }

    // findByProfile(profil: Profil) {
    //     return this.http.get<Observable<UtilisateurProfil[]>>(this.apiUrl + '/utilisateur-profil/by-profile/' + profil.id).pipe(
    //         map((resp: any) => resp.data)
    //     );
    // }

    // remove(profilUtilisateur: UtilisateurProfil) {
    //      // console.log(profilUtilisateur);
    //     return this.http.request('delete', this.apiUrl + '/utilisateur-profil/', { "body": profilUtilisateur });
    // }
}
