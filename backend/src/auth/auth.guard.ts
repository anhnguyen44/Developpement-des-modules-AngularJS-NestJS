import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
// tslint:disable-next-line: import-blacklist
import { ObservableInput, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { IncomingMessage } from 'http';
import {profils, ProfilsDroits} from '@aleaac/shared';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // console.log('AuthGuard');
        // SUPER IMPORTANT : COMMENT RCUPERER L4IP CI DESSOUS
        const req = context.switchToHttp().getRequest();
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        console.log(ip);

        const authorizedIP = ['::1', '127.0.0.1', '192.168.1',
            '109.0.189.182', // SRV DEV
            '37.187.127.95', // VPN
            '109.0.189.182',
            '82.227.198.101',
            '37.187.127.95',
            '128.79.84.42',
            '37.187.19.206',
            '193.251.90.133',
            '37.187.97.198',
        ];

        const roles = this.reflector.get<profils[]>('profils', context.getHandler());
        const droits = this.reflector.get<string[]>('droits', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const requestedUrl: string = context.getArgByIndex<IncomingMessage>(0).url;
        const user = request.user;

        // Si aucun role ni droit n'est demandé et qu'on est connecté ou qu'on est en train de se connecter, on renvoie true
        if ((!roles || (roles && roles.length === 0))
            && (!droits || (droits && droits.length === 0)) &&
            (user
                || (!user && requestedUrl.indexOf('/auth') > -1)
                || (!user && requestedUrl.indexOf('/ws') > -1)
                || (!user && requestedUrl.indexOf('affiche') > -1)
                || (!user && requestedUrl.indexOf('/chantier/importPaintDiag') > -1)
            )) {
            return of(true).toPromise();
        }

        // On protège le SA et lediteur de contenu
        if (requestedUrl.indexOf('/superadmin') > -1
            || requestedUrl.indexOf('/contenu-admin') > -1
        ) {
            let canAccess = false;

            for (const authip of authorizedIP) {
                if (authip.indexOf(ip) > -1) {
                    canAccess = true;
                    break;
                }
            }

            if (!canAccess) {
                return of(false).toPromise();
            }
        }

        // check si profils et droits
        if (user && !user.listeProfilsDroits || user && user.listeProfilsDroits && user.listeProfilsDroits.length === 0) {
            return of(false).toPromise();
        }

        const hasRole = () => roles && roles.length > 0
            ? this.checkRoles(user.listeProfilsDroits, roles)
            : true;

        const hasRight = () => droits && droits.length > 0
            ? this.checkRights(user.listeProfilsDroits, droits)
            : true;

        return hasRole() && hasRight() && user && !user.isSuspendu;
    }

    checkRights(listeProfilsDroits: ProfilsDroits[], toCheck: string[]): boolean {
        let result = false;

        for (const profilDroit of listeProfilsDroits) {
            if (profilDroit.droits.some((droit) => toCheck.indexOf(droit) > -1)) {
                result = true;
                break;
            }
        }
        return result;
    }

    checkRoles(listeProfilsDroits: ProfilsDroits[], toCheck: number[]): boolean {
        let result = false;

        for (const profilDroit of listeProfilsDroits) {

            if (profilDroit.idProfils.some((profil) => toCheck.indexOf(profil) > -1)) {
                result = true;
                break;
            }
        }
        return result;
    }

    /*checkRights(utilisaterProfils: UtilisateurProfil[], toCheck: string[]): boolean {
        let result = false;

        for (const userProfil of utilisaterProfils) {
            if (userProfil.profil.droits.some((droit) => toCheck.indexOf(droit.code) > -1)) {
                result = true;
                break;
            }
        }

        return result;
    }*/
}

export const allTrue = (...observables: Array<ObservableInput<boolean>>) =>
    combineLatest(observables).pipe(map(values => values.every(v => v === true)), distinctUntilChanged());
export const allFalse = (...observables: Array<ObservableInput<boolean>>) =>
    combineLatest(observables).pipe(map(values => values.every(v => v === false)), distinctUntilChanged());
export const anyTrue = (...observables: Array<ObservableInput<boolean>>) =>
    combineLatest(observables).pipe(map(values => values.find(v => v === true) !== undefined), distinctUntilChanged());
export const anyFalse = (...observables: Array<ObservableInput<boolean>>) =>
    combineLatest(observables).pipe(map(values => values.find(v => v === false) !== undefined), distinctUntilChanged());
