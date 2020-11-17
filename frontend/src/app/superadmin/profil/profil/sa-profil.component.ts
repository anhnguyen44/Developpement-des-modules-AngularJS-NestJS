import { IDroit, Profil } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { Droit } from '../../../resource/droit/Droit';
import { DroitService } from '../../../resource/droit/droit.service';
import { ProfilService } from '../../../resource/profil/profil.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';


@Component({
    selector: 'app-profil',
    templateUrl: './sa-profil.component.html',
    styleUrls: ['./sa-profil.component.scss']
})
export class ProfilComponent implements OnInit {
    profil?: Profil;
    profilForm: FormGroup;
    droitsForm: FormGroup;

    errorsDroits: string[] = new Array<string>();
    errorsProfil: string[] = new Array<string>();

    champsProfil: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom'],
        ['isVisibleFranchise', 'La visibilité par les franchisés'],
    ]);
    champsDroits: Map<string, string> = new Map<string, string>([
        ['newDroit', 'Le droit à ajouter'],
    ]);

    listeDroits: IDroit[];
    newDroit?: IDroit;
    id: number;
    submittedDroits: boolean = false;
    submittedProfil: boolean = false;
    compareFn = this._compareFn.bind(this);

    constructor(
        private menuService: MenuService,
        private profilService: ProfilService,
        private droitService: DroitService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private routerService: Router,
        private userService: UserService,
        private userStore: UserStore
    ) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.profilForm = this.formBuilder.group({
            id: [null, null],
            nom: ['', Validators.required],
            isVisibleFranchise: ['', null],
        });

        this.droitsForm = this.formBuilder.group({
            id: [null, null],
            newDroit: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Profils', '/superadmin/profil/liste'],
            ['Informations', '']
        ]);

        if (this.id) {
            this.profilService.getProfilById(this.id).subscribe((data) => {
                this.profil = data;
                this.InitForms();

                this.droitService.getAllDroit().subscribe((data2) => {
                    this.listeDroits = data2.filter(droit => this.profil!.droits!.findIndex(d => d.id === droit.id) === -1);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.profil = new Profil();
        }
    }

    private InitForms() {
        this.profilForm.patchValue(this.profil!);
    }

    onSubmitDroits() {
        if (!this.validateDroits()) {
            return;
        }

        this.profil = { ...this.profil, ...this.profilForm.value };
        if (!this.profil!.droits) {
            this.profil!.droits = new Array;
        }


        this.profil!.droits!.push(this.fDroits.newDroit.value);

        if (this.id) {
            this.profilService.updateProfil(this.profil!).subscribe(() => {
                this.notificationService.setNotification('success', ['Droit ajouté.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    validateDroits() {
        this.submittedDroits = true;
        // stop here if form is invalid

        let droitExists = false;

        if (this.profil && this.profil.droits) {
            this.profil.droits.forEach(droit => {
                if (droit.id && droit.id === this.fDroits.newDroit.value.id) {
                    droitExists = true;
                }
            });

            if (droitExists) {
                this.fDroits.newDroit.setErrors({ 'alreadyExists': true });
            }
        }

        if (this.droitsForm.invalid) {
            this.errorsDroits = [];
            this.errorsDroits = this.validationService.getFormValidationErrors(this.droitsForm, this.champsDroits);
            this.notificationService.setNotification('danger', this.errorsDroits);
            return false;
        } else {
            return true;
        }
    }

    validateProfil() {
        this.submittedProfil = true;
        // stop here if form is invalid

        if (this.profilForm.invalid) {
            this.errorsProfil = [];
            this.errorsProfil = this.validationService.getFormValidationErrors(this.profilForm, this.champsProfil);
            this.notificationService.setNotification('danger', this.errorsProfil);
            return false;
        } else {
            return true;
        }
    }

    onSubmitProfil() {
        if (!this.validateProfil()) {
            return;
        }

        this.profil = { ...this.profilForm.value};

        if (this.id) {
            this.profilService.updateProfil(this.profil!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Profil créé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.profilService.createProfil(this.profilForm.value).subscribe((data) => {
                this.notificationService.setNotification('success', ['Profil créé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    removeDroit(droit: Droit) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce profil de ce droit du profil ?')) {
            this.profil!.droits = this.profil!.droits!.filter(dr => dr.id! !== droit.id);
            this.profilService.updateProfil(this.profil!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Droit enlevé du profil.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    // convenience getter for easy access to form fields
    get fDroits() { return this.droitsForm.controls; }
    get fProfil() { return this.profilForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
