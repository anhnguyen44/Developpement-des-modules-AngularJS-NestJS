import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuDroit } from './MenuDroit';
import { ApiUrl } from '../api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MenuDefini, IDroit } from '@aleaac/shared';

@Injectable({
    providedIn: 'root'
})

export class MenuDroitService {
    apiUrl = environment.api;

    constructor(
        // @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient
    ) { }

    createMenuDroit(menuDroit: MenuDroit) {
        return this.http.post(this.apiUrl + '/menu-droit/', menuDroit).pipe(
            map((resp: any) => resp.data)
        );
    }

    remove(menuDroit: MenuDroit){
        return this.http.request('delete', this.apiUrl + '/menu-droit/',{ "body": menuDroit });
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
