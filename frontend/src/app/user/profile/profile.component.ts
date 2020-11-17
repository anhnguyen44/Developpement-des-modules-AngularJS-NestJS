import { Component, OnInit } from '@angular/core';

import { UserService } from '../../resource/user/user.service';
import { UserStore } from '../../resource/user/user.store';
import { MenuService } from '../../menu/menu.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUtilisateur, ICivilite, CodePostal } from '@aleaac/shared';
import { Utilisateur } from '@aleaac/shared/src/models/utilisateur.model';
import { NotificationService } from '../../notification/notification.service';
import { ValidationService } from '../../resource/validation/validation.service';
import { CiviliteService } from '../../resource/civilite/civilite.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    compareFn = this._compareFn.bind(this);

    user: Utilisateur;
    informationsForm: FormGroup;
    identifiantsForm: FormGroup;
    adresseForm: FormGroup;

    errorsInformations: string[] = new Array<string>();
    errorsIdentifiants: string[] = new Array<string>();
    errorsAdresse: string[] = new Array<string>();

    listeCivilite: ICivilite[];

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
    champsAdresse: Map<string, string> = new Map<string, string>([
        ['adresse', 'L\'adresse'],
        ['complement', 'Le cmplément d\'adresse'],
        ['cp', 'Le code postal'],
        ['ville', 'La ville'],
        ['telephone', 'Le numéro de téléphone'],
        ['fax', 'Le numéro de fax'],
        ['email', 'L\'email'],
    ]);

    submittedInformations = false;
    submittedIdentifiants = false;

    constructor(private userService: UserService,
        private notificationService: NotificationService,
        private userStore: UserStore,
        private menuService: MenuService,
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private civiliteService: CiviliteService) {
    }

    ngOnInit() {
        this.menuService.setMenu([['Mon compte', '']]);
        this.civiliteService.getAllCivilite().subscribe((data) => {
            this.listeCivilite = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

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
            adresseUser: this.adresseForm,
            franchisePrincipale: ['', null],
            qualite: ['', Validators.required],
            fonction: ['', Validators.required],
        }, {
                validator: this.validationService.RequireIf('franchisePrincipale',
                    this.user !== undefined && this.user.isInterne)
            });

        this.identifiantsForm = this.formBuilder.group({
            id: [null, null],
            motDePasse: ['', [Validators.minLength(6)]],
            motDePasseConfirmation: ['', null],
            loginGoogleAgenda: ['', Validators.email],
        }, {
                validators: [
                    this.validationService.MustMatch('motDePasse', 'motDePasseConfirmation')
                ],
                updateOn: 'submit'
            });

        this.userService.getUser().subscribe((data) => {
            this.user = data;
            this.informationsForm.patchValue(this.user);
            this.adresseForm.patchValue(this.user!.adresse);
            this.identifiantsForm.patchValue(this.user);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    onSubmitInformations() {
        let doNotContinue = false;
        if (!this.validateAdresse()) {
            doNotContinue = true;
        }

        if (!this!.validateInformations()) {
            doNotContinue = true;
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations.concat(this.errorsAdresse));
            return;
        }

        this.user = { ...this.user, ...this.informationsForm.value };

        if (this.informationsForm.value['franchisePrincipale']) {
            this.user!.idFranchisePrincipale = this.informationsForm.value['franchisePrincipale'].id;
            delete this.user!.franchisePrincipale;
        }
        this.user!.adresse = { ...this.adresseForm.value };

        if (this.user) {
            this.userService.updateUser(this.user!).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
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
        if (!this.validateIdentifiants()) {
            this.notificationService.setNotification('danger', this.errorsIdentifiants);
            return;
        }

        this.user = { ...this.user, ...this.identifiantsForm.value };
        delete this.user!.motDePasseConfirmation;

        this.userService.updateUser(this.user!).subscribe(() => {
            this.notificationService.setNotification('success', ['Identifiants mises à jour.']);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }
    get fIdentifiants() { return this.identifiantsForm.controls; }
    get fAdresse() { return this.adresseForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseForm.controls['cp'].setValue(cpVille.numCP);
            this.adresseForm.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
