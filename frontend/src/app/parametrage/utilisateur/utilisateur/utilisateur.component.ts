import { CUtilisateurProfil, Franchise, ICivilite, IFranchise, Utilisateur, Qualite, IFonction, CodePostal, EnumTypeFichier } from '@aleaac/shared';
import { Component, OnInit, Input, AfterViewChecked, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { CiviliteService } from '../../../resource/civilite/civilite.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { Profil } from '../../../resource/profil/Profil';
import { ProfilService } from '../../../resource/profil/profil.service';
import { UtilisateurProfilService } from '../../../resource/profil/utilisateur-profil.service';
import { UserService } from '../../../resource/user/user.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { UtilisateurProfil } from '../../../resource/profil/UtilisateurProfil';
import { QualiteService } from '../../../resource/qualite/qualite.service';
import { NotificationService } from '../../../notification/notification.service';
import { UserStore } from '../../../resource/user/user.store';
import { FonctionService } from '../../../resource/fonction/fonction.service';
import { anyTrue, allTrue } from '../../../resource/helper';
import { of } from 'rxjs/internal/observable/of';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { LoginService } from '../../../resource/user/login.service';
import { Fichier } from '../../../resource/fichier/Fichier';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { LoaderService } from '../../../loader/loader.service';
import { FichierService } from '../../../resource/fichier/fichier.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-utilisateur',
    templateUrl: './utilisateur.component.html',
    styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit, AfterViewChecked {
    @Input() superAdminId: number;

    apiUrl = environment.api;
    signatureUrl: string;

    @ViewChildren('fileInput') fileInputs;
    fichiers: Map<number, Fichier> = new Map<number, Fichier>();
    fichier: Fichier;
    fileName: string;
    typeFichier: TypeFichier;

    compareFn = this._compareFn.bind(this);

    utilisateur?: Utilisateur;
    informationsForm: FormGroup;
    identifiantsForm: FormGroup;
    adresseForm: FormGroup;
    droitsForm: FormGroup;
    profilsForm: FormGroup;

    errorsInformations: string[] = new Array<string>();
    errorsIdentifiants: string[] = new Array<string>();
    errorsDroits: string[] = new Array<string>();
    errorsProfils: string[] = new Array<string>();
    errorsAdresse: string[] = new Array<string>();

    champsInformations: Map<string, string> = new Map<string, string>([
        ['civilite', 'La civilité'],
        ['nom', 'Le nom'],
        ['prenom', 'Le prénom'],
        ['raisonSociale', 'La raison sociale'],
        ['telephone', 'Le numéro de téléphone'],
        ['mobile', 'Le numéro de mobile'],
        ['fax', 'Le numéro de fax'],
        ['emailContact', 'L\'adresse mail de contact'],
        ['adresse', 'L\'adresse'],
        ['complementAdresse', 'Le complément d\'adresse'],
        ['ville', 'La ville'],
        ['codePostal', 'Le code postal'],
        ['franchisePrincipale', 'La franchise principale'],
        ['qualite', 'La qualité'],
        ['fonction', 'La fonction'],
    ]);
    champsIdentifiants: Map<string, string> = new Map<string, string>([
        ['login', 'Le login'],
        ['loginGoogleAgenda', 'Le login Google Agenda'],
        ['motDePasse', 'Le mot de passe'],
        ['motDePasseConfirmation', 'La confirmation du mot de passe']
    ]);
    champsDroits: Map<string, string> = new Map<string, string>([
        ['utilisateurParent', 'L\'utilisateur parent'],
        ['isSuspendu', 'La suspension'],
        ['isHabilite', 'L\'habilitation'],
        ['niveauHabilitation', 'le niveau d\'habilitation'],
        ['dateValiditeHabilitation', 'La date de validité de l\'habilitation'],
    ]);
    champsAdresse: Map<string, string> = new Map<string, string>([
        ['adresse', 'L\'adresse'],
        ['complement', 'Le cmplément d\'adresse'],
        ['cp', 'Le code postal'],
        ['ville', 'La ville'],
        ['telephone', 'Le numéro de téléphone'],
        ['fax', 'Le numéro de fax'],
        ['email', 'L\'email'],
    ]);
    champsProfils: Map<string, string> = new Map<string, string>([
        ['newProfil', 'Le profil'],
        ['newProfilFranchise', 'La franchise']
    ]);

    listeCivilite: ICivilite[];
    listeFonction: IFonction[];
    listeProfils: Profil[];
    listeFranchisesUser: IFranchise[] = new Array<IFranchise>();
    listeFranchises: Franchise[] = new Array<Franchise>();
    listeQualites: Qualite[];
    listeUsersDisponibles: Utilisateur[] = new Array<Utilisateur>();
    id: number;
    submittedInformations = false;
    submittedIdentifiants = false;
    submittedDroits = false;
    submittedProfils = false;

    currentUser: Utilisateur;
    canSeeBlocDroits: Promise<boolean>;
    canSeeDroitsUser: Promise<boolean>;
    cansSeeProfilsUser: Promise<boolean>;

    // Utilisé pour scroll directement sur un #id depuis l'URL
    fragment: string;

    constructor(
        private menuService: MenuService,
        private userService: UserService,
        public userStore: UserStore,
        private civiliteService: CiviliteService,
        private profilService: ProfilService,
        private qualiteService: QualiteService,
        private utilisateurProfilService: UtilisateurProfilService,
        private franchiseService: FranchiseService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private routerService: Router,
        private fonctionService: FonctionService,
        private loginService: LoginService,
        private loaderService: LoaderService,
        private fichierService: FichierService,
    ) {
        this.civiliteService.getAllCivilite().subscribe((data) => {
            this.listeCivilite = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.fonctionService.getAll().subscribe((data) => {
            this.listeFonction = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        if (this.superAdminId !== undefined) {
            this.id = this.superAdminId;
        } else {
            this.route.params.subscribe(params => {
                this.id = params['id'];
            });
        }

        this.adresseForm = this.formBuilder.group({
            id: [null, null],
            adresse: ['', Validators.required],
            complement: ['', null],
            cp: [null, Validators.required],
            ville: ['', Validators.required],
            email: ['', Validators.email],
            telephone: ['', null],
            fax: ['', null],
        });

        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            civilite: [, Validators.required],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            raisonSociale: ['', null],
            telephone: ['', null],
            mobile: ['', null],
            fax: ['', null],
            adresse: this.adresseForm,
            franchisePrincipale: ['', null],
            qualite: ['', Validators.required],
            fonction: ['', Validators.required],
        }, {
                validator: this.validationService.RequireIf('franchisePrincipale',
                    this.id !== undefined && this.utilisateur !== undefined && this.utilisateur.isInterne)
            });

        this.identifiantsForm = this.formBuilder.group({
            id: [null, null],
            login: ['', [Validators.required, Validators.email]],
            motDePasse: ['', [Validators.minLength(6)]],
            motDePasseConfirmation: ['', null],
            loginGoogleAgenda: ['', Validators.email],
        }, {
                validators: [this.validationService.MustMatch('motDePasse', 'motDePasseConfirmation')
                    , this.validationService.RequireIf('motDePasse', this.id === undefined || this.id === null)
                    , this.validationService.RequireIf('motDePasseConfirmation', this.id === undefined || this.id === null)
                ]
            });

        this.droitsForm = this.formBuilder.group({
            id: [null, null],
            isSuspendu: ['', null],
            utilisateurParent: [null, null],
            isHabilite: ['', null],
            niveauHabilitation: ['', null],
            dateValiditeHabilitation: ['', null],
        });

        this.profilsForm = this.formBuilder.group({
            newProfil: ['', Validators.required],
            newProfilFranchise: ['', Validators.required],
        });

    }

    async ngOnInit() {
        if (this.superAdminId === undefined) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Utilisateurs', '/parametrage/utilisateur/liste'],
                ['Informations', '']
            ]);
        }

        if (this.id) {
            this.userService.getUserByIdWithProfilFranchise(this.id).subscribe((data) => {
                this.utilisateur = data;
                this.InitForms();
                this.route.fragment.subscribe(fragment => { this.fragment = fragment; }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.utilisateur = new Utilisateur();
        }

        if (this.id) {
            this.userService.getAllUser().subscribe((data) => {
                this.listeUsersDisponibles = data.filter(u => u.id !== this.id);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }

        this.currentUser = this.userStore.user.getValue();
        this.canSeeDroitsUser = anyTrue(this.userStore.hasProfil(profils.FRANCHISE),
            this.userStore.hasProfil(profils.ADMIN),
            this.userStore.hasProfil(profils.SUPER_ADMIN)).toPromise();
        this.cansSeeProfilsUser = anyTrue(this.userStore.hasRight('PROFILES_ALL_USERS')
            , allTrue(this.userStore.hasRight('PROFILES_CREATED_USERS'),
                of(this.listeUsersDisponibles.indexOf(this.utilisateur!) > -1))).toPromise();
        this.canSeeBlocDroits = anyTrue(this.canSeeDroitsUser, this.cansSeeProfilsUser).toPromise();

        this.profilService.getAllProfil().subscribe((data) => {
            this.listeProfils = data;
            console.log(this.listeProfils);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.franchiseService.getAllFranchise().subscribe((data) => {
            this.listeFranchises = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.qualiteService.getAllQualite().subscribe((data) => {
            this.listeQualites = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    private InitForms() {
        this.informationsForm.patchValue(this.utilisateur!);
        if (this.utilisateur!.profils) {
            this.utilisateur!.profils!.forEach(profil => {
                if (this.listeFranchisesUser.find(el => el && el.id === profil.idFranchise) === undefined) {
                    this.listeFranchisesUser.push(profil.franchise);
                }
            });
        }
        this.identifiantsForm.patchValue(this.utilisateur!);
        this.droitsForm.patchValue(this.utilisateur!);
        this.adresseForm.patchValue(this.utilisateur!.adresse);

        if (this.utilisateur && this.utilisateur.signature) {
            this.signatureUrl = this.apiUrl + '/fichier/affiche/' + this.utilisateur!.signature.keyDL;
        } else if (this.utilisateur && this.utilisateur.idSignature) {
            this.fichierService.getFichierById(this.utilisateur.idSignature).subscribe(fic => {
                this.signatureUrl = this.apiUrl + '/fichier/affiche/' + fic.keyDL;
            });
        }
    }

    ngAfterViewChecked(): void {
        try {
            if (this.fragment) {
                document.querySelector('#' + this.fragment)!.scrollIntoView();
            }
        } catch (e) { }
    }

    onSubmitInformations() {
        let doNotContinue = false;
        if (!this.validateAdresse()) {
            doNotContinue = true;
        }

        if (!this!.validateInformations()) {
            doNotContinue = true;
            this.validateAllFields(this.informationsForm);
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations.concat(this.errorsAdresse));
            return;
        }

        this.utilisateur = { ...this.utilisateur, ...this.informationsForm.value };

        if (this.utilisateur!.signature || this.utilisateur!.signature === null || this.utilisateur!.idSignature) {
            if (this.utilisateur!.signature) {
                if (this.utilisateur!.signature !== null) {
                    this.utilisateur!.idSignature = this.utilisateur!.signature.id;
                }
                delete this.utilisateur!.signature;
            }
        }

        if (this.informationsForm.value['franchisePrincipale']) {
            this.utilisateur!.idFranchisePrincipale = this.informationsForm.value['franchisePrincipale'].id;
            delete this.utilisateur!.franchisePrincipale;
        }
        this.utilisateur!.adresse = { ...this.adresseForm.value };

        if (this.id) {
            delete this.utilisateur!.motDePasseConfirmation;
            this.userService.updateUser(this.utilisateur!).subscribe(() => {
                this.informationsForm.markAsPristine();
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
                this.informationsForm.markAsPristine();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    onSubmitDroits() {
        if (!this.validateDroits()) {
            return;
        }

        this.utilisateur = { ...this.utilisateur, ...this.droitsForm.value };
        if (!this.utilisateur!.isHabilite) {
            this.utilisateur!.niveauHabilitation = undefined;
            this.utilisateur!.dateValiditeHabilitation = undefined;
        }

        if (this.id) {
            this.userService.updateUser(this.utilisateur!).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
                this.droitsForm.markAsPristine();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    validateInformations() {
        this.submittedInformations = true;
        this.errorsInformations = [];
        // stop here if form is invalid
        if (this.informationsForm.invalid) {
            this.errorsInformations = this.validationService.getFormValidationErrors(this.informationsForm, this.champsInformations);
            return false;
        } else {
            return true;
        }
    }

    validateDroits() {
        this.submittedDroits = true;
        this.errorsDroits = [];
        // stop here if form is invalid

        if (this.fDroits.isHabilite.value === true) {
            if (!this.fDroits.niveauHabilitation.value) {
                this.fDroits.niveauHabilitation.setErrors({ required: true });
            }
            if (!this.fDroits.dateValiditeHabilitation.value || this.fDroits.dateValiditeHabilitation.value === '0000-00-00') {
                this.fDroits.dateValiditeHabilitation.setErrors({ required: true });
            }
        }

        if (this.droitsForm.invalid) {
            this.errorsDroits = this.validationService.getFormValidationErrors(this.droitsForm, this.champsDroits);
            this.notificationService.setNotification('danger', this.errorsDroits);
            return false;
        } else {
            return true;
        }
    }

    validateProfils() {
        this.submittedProfils = true;
        this.errorsProfils = [];
        // stop here if form is invalid
        let profileExists = false;

        if (this.utilisateur && this.utilisateur.profils) {
            this.utilisateur.profils.forEach(profil => {
                if (profil.franchise && profil.profil && profil.franchise.id === this.fProfils.newProfilFranchise.value.id
                    && profil.profil.id === this.fProfils.newProfil.value.id) {
                    profileExists = true;
                }
            });

            if (profileExists) {
                this.profilsForm.controls['newProfil'].setErrors({ 'alreadyExists': true });
            }
        }

        if (this.profilsForm.invalid) {
            this.errorsProfils = this.validationService.getFormValidationErrors(this.profilsForm, this.champsProfils);
            this.notificationService.setNotification('danger', this.errorsProfils);
            return false;
        } else {
            return true;
        }
    }

    validateIdentifiants() {
        this.errorsIdentifiants = [];
        this.submittedIdentifiants = true;
        // stop here if form is invalid
        if (this.identifiantsForm.invalid) {
            this.errorsIdentifiants = this.validationService.getFormValidationErrors(this.identifiantsForm, this.champsIdentifiants);
            return false;
        } else {
            return true;
        }
    }

    validateAdresse() {
        // stop here if form is invalid
        this.submittedIdentifiants = true;
        this.errorsAdresse = [];
        if (this.adresseForm.invalid) {
            this.errorsAdresse = this.validationService.getFormValidationErrors(this.adresseForm, this.champsAdresse);
            return false;
        } else {
            return true;
        }
    }

    onSubmitIdentifiants() {
        if (this.id) {
            if (!this.validateIdentifiants()) {
                this.notificationService.setNotification('danger', this.errorsIdentifiants);
                return;
            }

            this.utilisateur = { ...this.utilisateur, ...this.identifiantsForm.value };

            this.userService.updateUser(this.utilisateur!).subscribe(() => {
                this.notificationService.setNotification('success', ['Identifiants mises à jour.']);
                this.identifiantsForm.markAsPristine();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            let doNotContinue = false;
            if (!this.validateAdresse()) {
                doNotContinue = true;
            }

            if (!this!.validateInformations()) {
                doNotContinue = true;
                this.validateAllFields(this.informationsForm);
            }

            if (!this!.validateIdentifiants()) {
                doNotContinue = true;
            }

            if (doNotContinue === true) {
                this.notificationService.setNotification('danger',
                    this.errorsInformations.concat(this.errorsAdresse).concat(this.errorsIdentifiants));
                return;
            }
            this.utilisateur = { ...this.identifiantsForm.value, ...this.informationsForm.value };
            this.utilisateur!.adresse = { ...this.adresseForm.value };
            this.utilisateur!.createdBy = this.userStore.user.getValue();

            this.userService.createUser(this.utilisateur!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Utilisateur créé.']);
                const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                this.routerService.navigate([moduleToUse + '/utilisateur/modifier', data.id]);
                this.informationsForm.markAsPristine();
                this.identifiantsForm.markAsPristine();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    onSubmitProfils() {
        if (!this.validateProfils()) {
            return;
        }

        if (this.id) {
            this.utilisateurProfilService.createUtilisateurProfil({
                utilisateur: this.utilisateur!,
                franchise: this.fProfils.newProfilFranchise.value, profil: this.fProfils.newProfil.value
            }).subscribe((data) => {
                this.notificationService.setNotification('success', ['Profil ajouté.']);
                // console.log(data);
                if (!this.utilisateur!.profils) {
                    this.utilisateur!.profils = new Array;
                }
                this.utilisateur!.profils!.push(data);

                // On ajoute dans la liste de ses franchises si elle n'y est pas déjà
                if (this.listeFranchisesUser.find(el => el && el.id === this.fProfils.newProfilFranchise.value.id) === undefined) {
                    this.listeFranchisesUser.push(this.fProfils.newProfilFranchise.value);
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    removeProfile(profil: UtilisateurProfil) {
        profil.utilisateur = this.utilisateur!;

        // On évite d'avoir une structure circulaire, sinon ça veut pas envoyer
        delete profil.utilisateur.franchisePrincipale;
        delete profil.franchise.utilisateurs;
        delete profil.utilisateur.profils;

        // console.log(profil);
        if (confirm('Êtes-vous sûr de vouloir supprimer ce profil de cet utilisateur ?')) {
            this.utilisateurProfilService.remove(profil).subscribe(data => {
                this.utilisateurProfilService.findByUtilisateur(this.utilisateur!).subscribe(data2 => {
                    this.utilisateur!.profils = data2;

                    // On reset la liste des franchises
                    this.listeFranchisesUser = [];
                    if (this.utilisateur!.profils) {
                        this.utilisateur!.profils!.forEach(prof => {
                            if (this.listeFranchisesUser.find(el => el.id === prof.idFranchise) === undefined) {
                                this.listeFranchisesUser.push(prof.franchise);
                            }
                        });
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    qualiteChange() {
        this.utilisateur!.isInterne = this.f.qualite.value.isInterne;
    }

    impersonate() {
        this.loginService.impersonate(this.utilisateur!.login, '');
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }


    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    resetForm(formGroup: FormGroup) {
        formGroup.patchValue(this.utilisateur!);
        formGroup.markAsPristine();
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }
    get fIdentifiants() { return this.identifiantsForm.controls; }
    get fDroits() { return this.droitsForm.controls; }
    get fProfils() { return this.profilsForm.controls; }
    get fAdresse() { return this.adresseForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }



    openFileChange(type: number) {
        const event = new MouseEvent('click', { bubbles: false });
        this.fileInputs.find(x => x.nativeElement.id.indexOf(type) > -1).nativeElement.dispatchEvent(event);
    }

    onFileChange(event, type: number) {
        if (!this.fichiers[type]) {
            this.fichier = new Fichier();
            this.fichier.typeFichier = {
                id: EnumTypeFichier.USER_SIGNATURE, nom: 'Signature', affectable: true,
                idGroupe: 6, groupe: { id: 6, nom: 'USER' }
            };
            this.fichier.idUtilisateur = this.currentUser.id; // TODO : Mettre le user conencté
            this.fichier.application = 'utilisateur';
            this.fichier.idParent = this.utilisateur!.id;
        }
        if (event.target.files.length > 0) {
            this.fichier.file = this.fileInputs.find(x => x.nativeElement.id.indexOf(type) > -1).nativeElement.files;
            this.fileName = this.fichier.file[0].name;
            this.fichier.extention = this.fichier.file[0].name.split('.').pop();
            if (!this.fichier.nom) {
                this.fichier.nom = this.fichier.file[0].name.split('.')[0];
            }
        }
        this.fichiers.set(type, this.fichier);
        this.envoyerSignature();
    }

    envoyerSignature() {
        console.log(this.fichier);
        console.log(this.utilisateur);

        if (this.fichier.file && this.fichier.file[0] && this.fichier.nom && this.fichier.typeFichier) {
            const formData = new FormData();
            formData.append('file', this.fichier.file[0]);
            formData.append('nom', this.fichier.nom);
            formData.append('idUtilisateur', this.fichier.idUtilisateur.toString());
            formData.append('extention', this.fichier.extention);
            formData.append('application', 'utilisateur');
            formData.append('idParent', this.utilisateur!.id.toString());
            formData.append('idTypeFichier', '27');
            formData.append('commentaire', '');
            this.loaderService.show();
            this.fichierService.saveResize(formData, 200, 150).subscribe((fichier) => {
                this.loaderService.hide();
                fichier.typeFichier = this.typeFichier;

                if (this.utilisateur!.signature || this.utilisateur!.signature === null || this.utilisateur!.idSignature === null) {
                    delete this.utilisateur!.signature;
                    delete this.utilisateur!.idSignature;
                    this.utilisateur!.idSignature = fichier.id;
                    this.signatureUrl = this.apiUrl + '/fichier/affiche/' + fichier.keyDL;
                }

                this.userService.updateUser(this.utilisateur!).subscribe(() => {
                    this.notificationService.setNotification('success', ['Signature mise à jour.']);
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            const erreur = new Array();
            if (!this.fichier.file) {
                erreur.push('Il faut ajouter un fichier.');
            }
            if (!this.fichier.nom) {
                erreur.push('Il faut saisir un nom pour votre fichier.');
            }
            if (!this.fichier.typeFichier) {
                erreur.push('Il faut saisir un type de fichier.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }
}
