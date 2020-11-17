import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';

import {UserService} from './user.service';
import {Utilisateur, Civilite, Qualite, IFichier} from '@aleaac/shared';
import {Historique} from '../historique/Historique';
import {FranchiseService} from '../franchise/franchise.service';
import {Adresse} from '@aleaac/shared/src/models/adresse.model';
import {LoginService} from './login.service';
import {Fonction} from '@aleaac/shared/src/models/fonction.model';
import {profils} from '@aleaac/shared/src/models/profil.model';
import {UtilisateurProfil} from '../profil/UtilisateurProfil';
import {Fichier} from '../fichier/Fichier';

@Injectable()
export class UserStore {
    private _user: BehaviorSubject<Utilisateur> = new BehaviorSubject<Utilisateur>({
        id: -1,
        civilite: new Civilite(),
        qualite: new Qualite(),
        fonction: new Fonction(),
        nom: '',
        prenom: '',
        raisonSociale: '',
        mobile: '',
        createdBy: undefined,

        /** ADRESSE */
        adresse: new Adresse(),
        /** CONNEXION */
        login: '',
        motDePasse: '',
        loginGoogleAgenda: '',
        isSuspendu: false,
        utilisateurParent: undefined,
        franchisePrincipale: undefined,

        /** DROITS */
        isHabilite: false,
        niveauHabilitation: undefined,
        dateValiditeHabilitation: undefined,
        profils: new Array<UtilisateurProfil>(),
        isInterne: false,
        historiques: new Array<Historique>(),
        tokenResetPassword: '',
        dateDemandeResetPassword: new Date(),
        dateResetPassword: new Date(),
        ipResetPassword: '',
        signature: new Fichier(),
        idSignature: -1
    });
    public isLoggedIn: boolean;

    constructor(
        private userService: UserService,
        private franchiseService: FranchiseService
    ) {
    }

    get user(): BehaviorSubject<Utilisateur> {
        if (this.isLoggedIn && (!this._user.value || this._user.value.id === -1)) {
            this.userService.getUser().subscribe(user => {
                this.user.next(user);
            });
        }
        return this._user;
    }

    setUser(user: Utilisateur): void {
        this.user.next(user);
    }

    clear() {
        this._user = new BehaviorSubject<Utilisateur>({
            id: -1,
            civilite: new Civilite(),
            qualite: new Qualite(),
            fonction: new Fonction(),
            nom: '',
            prenom: '',
            raisonSociale: '',
            mobile: '',
            createdBy: undefined,

            /** ADRESSE */
            adresse: new Adresse(),
            /** CONNEXION */
            login: '',
            motDePasse: '',
            loginGoogleAgenda: '',
            isSuspendu: false,
            utilisateurParent: undefined,
            franchisePrincipale: undefined,

            /** DROITS */
            isHabilite: false,
            niveauHabilitation: undefined,
            dateValiditeHabilitation: undefined,
            profils: new Array<UtilisateurProfil>(),
            isInterne: false,
            historiques: new Array<Historique>(),
            tokenResetPassword: '',
            dateDemandeResetPassword: new Date(),
            dateResetPassword: new Date(),
            ipResetPassword: '',
            signature: new Fichier(),
            idSignature: -1
        });
    }

    async hasProfil(id: profils): Promise<boolean> {
        let result: boolean = false;

        const monCode = function (self: UserStore): boolean {

            if (self.user.getValue().profils) {
                for (const pro of self.user.getValue().profils!) {
                    if (pro.profil && pro.profil.id === id) {
                        result = true;
                        break;
                    }
                }
            }

            return result;
        };

        if (!this.user.getValue() || (this.user.getValue() && this.user.getValue().id === -1)) {
            await this.userService.getUser().subscribe(user => {
                // On met le user en mémoire si on l'a, sinon c'est qu'il n'existe pas (getById fail)
                if (user) {
                    this.setUser(user);
                    try {
                        this.franchiseService.franchises.subscribe((data) => {
                            if (data.length === 0) {
                                this.franchiseService.getByUser(user.id).subscribe((franchises) => {
                                    this.franchiseService.setFranchises(franchises);
                                    this.franchiseService.setFranchise(franchises[0]);
                                });
                            }
                        });
                    } catch (err) {
                        console.error(err);
                    }
                    return monCode(this);
                } else {
                    return false;
                }
            }, () => {
                // Si une erreur survient pendant qu'on interroge le backend, on renvoie false
                return false;
            });
        } else {
            // Si on a déjà le user, on peut juste check les droits
            return await monCode(this);
        }

        return await result;
    }

    async hasRight(code: string): Promise<boolean> {
        let result: boolean = false;
        const monCode = function (self: UserStore): boolean {
            if (self.user.getValue().profils) {
                boucleprofils:
                    for (const pro of self.user.getValue().profils!) {
                        if (pro.profil && pro.profil.droits) {
                            for (const droit of pro.profil.droits) {
                                if (droit.code === code) {
                                    result = true;
                                    break boucleprofils; // On break les 2 boucles comme ça, gain de perfs
                                }
                            }
                        }
                    }
            }

            return result;
        };

        // Il faut le user mais c'est asynchrone donc obligé de subscribe car la fonction ne peut pas être async
        if (!this.user.getValue() || (this.user.getValue() && this.user.getValue().id === -1)) {
            await this.userService.getUser().subscribe(user => {
                // On met le user en mémoire si on l'a, sinon c'est qu'il n'existe pas (getById fail)
                if (user) {
                    this.setUser(user);
                    this.franchiseService.franchises.subscribe((data) => {
                        if (data.length === 0) {
                            this.franchiseService.getByUser(user.id).subscribe((franchises) => {
                                this.franchiseService.setFranchises(franchises);
                                this.franchiseService.setFranchise(franchises[0]);
                            });
                        }
                    });
                    return monCode(this);
                } else {
                    return false;
                }
            }, () => {
                // Si une erreur survient pendant qu'on interroge le backend, on renvoie false
                return false;
            });
        } else {
            // Si on a déjà le user, on peut juste check les droits
            return monCode(this);
        }

        return await result;
    }
}
