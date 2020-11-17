import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { NotificationService } from '../../../notification/notification.service';
import { DroitService } from '../../../resource/droit/droit.service';
import { Droit } from '../../../resource/droit/Droit';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';


@Component({
    selector: 'app-droit',
    templateUrl: './sa-droit.component.html',
    styleUrls: ['./sa-droit.component.scss']
})
export class DroitComponent implements OnInit {
    droit?: Droit;
    droitForm: FormGroup;
    errorsDroit: string[] = new Array<string>();

    champsDroit: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom'],
    ]);

    id: number;
    submittedDroit: boolean = false;
    compareFn = this._compareFn.bind(this);

    constructor(
        private menuService: MenuService,
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
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.droitForm = this.formBuilder.group({
            id: [null, null],
            nom: ['', Validators.required],
            code: ['', Validators.required],
            niveau: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Droits', '/superadmin/droit/liste'],
            ['Informations', '']
        ]);

        if (this.id) {
            this.droitService.getDroitById(this.id).subscribe((data) => {
                this.droit = data;
                this.InitForms();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.droit = new Droit();
        }
    }

    private InitForms() {
        this.droitForm.patchValue(this.droit!);
    }

    validateDroit() {
        this.submittedDroit = true;
        // stop here if form is invalid
        if (this.droitForm.invalid) {
            this.errorsDroit = [];
            this.errorsDroit = this.validationService.getFormValidationErrors(this.droitForm, this.champsDroit);
            this.notificationService.setNotification('danger', this.errorsDroit);
            return false;
        } else {
            return true;
        }
    }

    onSubmitDroit() {
        if (!this.validateDroit()) {
            return;
        }

        this.droit = { ...this.droit, ...this.droitForm.value};

        if (this.id) {
            this.droitService.updateDroit(this.droit!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.droitService.createDroit(this.droitForm.value).subscribe((data) => {
                this.notificationService.setNotification('success', ['Droit créé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    // convenience getter for easy access to form fields
    get fDroit() { return this.droitForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
