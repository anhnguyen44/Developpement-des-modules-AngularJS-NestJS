import { Franchise, ICivilite, IFranchise, GrilleTarif, Qualite, IFonction, TypeGrille, profils } from '@aleaac/shared';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { GrilleTarifService } from '../../../resource/grille-tarif/grille-tarif.service';
import { TypeGrilleService } from '../../../resource/grille-tarif/type-grille.service';
import { NotificationService } from '../../../notification/notification.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';


@Component({
    selector: 'app-grille-tarif',
    templateUrl: './tarif.component.html',
    styleUrls: ['./tarif.component.scss']
})
export class GrilleTarifComponent implements OnInit {
    @Input() superAdminId: number;
    compareFn = this._compareFn.bind(this);

    grilleTarif: GrilleTarif = new GrilleTarif();
    informationsForm: FormGroup;

    errorsInformations: string[] = new Array<string>();

    champsInformations: Map<string, string> = new Map<string, string>([
        ['typeGrille', 'Le type de grille'],
        ['conditions', 'Les conditions'],
        ['commentaire', 'Le commentaire'],
    ]);

    id: number;
    submittedInformations = false;
    listeTypeGrille: TypeGrille[];
    isRefInvalide: boolean = false;

    constructor(
        private menuService: MenuService,
        private grilleTarifService: GrilleTarifService,
        private franchiseService: FranchiseService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private routerService: Router,
        private typeGrilleService: TypeGrilleService
    ) {
        if (this.superAdminId !== undefined) {
            this.id = this.superAdminId;
        } else {
            this.route.params.subscribe(params => {
                this.id = params['id'];
            });
        }

        this.typeGrilleService.getAll().subscribe(data => {
            this.listeTypeGrille = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            typeGrille: [, null],
            conditions: [null, null],
            commentaire: [null, null]
        }, {
                validator: this.validationService.RequireIf('typeGrille', this.id === undefined)
            });
    }

    async ngOnInit() {
        if (this.superAdminId === undefined) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Grilles tarif', '/parametrage/grilleTarif/liste'],
                ['Informations', '']
            ]);
        }

        if (this.id) {
            this.grilleTarifService.getGrilleTarifById(this.id).subscribe((data) => {
                this.grilleTarif = data;
                console.log(data);
                this.InitForms();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.grilleTarif = new GrilleTarif();
            this.franchiseService.franchise.subscribe(data => {
                this.grilleTarif!.franchise = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    private InitForms() {
        this.informationsForm.patchValue(this.grilleTarif!);
    }

    onSubmitInformations() {
        let doNotContinue = false;

        if (!this!.validateInformations()) {
            doNotContinue = true;
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations);
            return;
        }

        this.grilleTarif = { ...this.grilleTarif, ...this.informationsForm.value };

        if (this.id) {
            delete this.grilleTarif.details;
            this.grilleTarifService.updateGrilleTarif(this.grilleTarif!).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
                const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                this.routerService.navigate([moduleToUse + '/grilleTarif/modifier/details', this.id]);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.grilleTarifService.createGrilleTarif(this.grilleTarif!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Grille créée.']);
                const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                this.routerService.navigate([moduleToUse + '/grilleTarif/modifier/details', data.id]);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    validateInformations() {
        this.submittedInformations = true;
        this.errorsInformations = [];
        if (!this.grilleTarif!.reference || this.grilleTarif!.reference === '') {
            this.errorsInformations.push('La référence est obligatoire.');
            this.isRefInvalide = true;
        } else {
            this.isRefInvalide = false;
        }
        // stop here if form is invalid
        if (this.informationsForm.invalid || this.isRefInvalide) {
            this.errorsInformations.push(...this.validationService.getFormValidationErrors(this.informationsForm, this.champsInformations));
            return false;
        } else {
            return true;
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
