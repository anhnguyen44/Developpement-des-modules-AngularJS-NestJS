import { IDroit, Produit, TypeProduit } from '@aleaac/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { ProduitService } from '../../../resource/produit/produit.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import { TypeProduitService } from '../../../resource/produit/type-produit.service';


@Component({
    selector: 'app-produit',
    templateUrl: './sa-produit.component.html',
    styleUrls: ['./sa-produit.component.scss']
})
export class ProduitComponent implements OnInit {
    produit?: Produit;
    produitForm: FormGroup;
    listeTypeProduit: TypeProduit[];


    errorsDroits: string[] = new Array<string>();
    errorsProduit: string[] = new Array<string>();

    champsProduit: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom'],
        ['code', 'Le code produit'],
        ['tempsUnitaire', 'Le temps de référence'],
        ['uniteTemps', 'L\'unité de temps'],
        ['prixUnitaire', 'Le prix unitaire'],
        ['description', 'La description'],
    ]);

    id: number;
    submittedProduit: boolean = false;
    compareFn = this._compareFn.bind(this);

    constructor(
        private menuService: MenuService,
        private produitService: ProduitService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private routerService: Router,
        private userService: UserService,
        private userStore: UserStore,
        private typeProduitService: TypeProduitService
    ) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        // console.log(this.id);

        this.produitForm = this.formBuilder.group({
            id: [null, null],
            nom: ['', Validators.required],
            code: ['', Validators.required],
            description: ['', Validators.required],
            prixUnitaire: ['', Validators.required],
            tempsUnitaire: ['', null],
            uniteTemps: ['', null],
            isGeneral: [true, null],
            hasTemps: ['', null],
            type: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Produits', '/superadmin/produit/liste'],
            ['Informations', '']
        ]);

        if (this.id) {
            this.produitService.getProduitById(this.id).subscribe((data) => {
                this.produit = data;
                this.InitForms();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.produit = new Produit();
        }

        this.typeProduitService.getAll().subscribe((data) => {
            this.listeTypeProduit = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    private InitForms() {
        this.produitForm.patchValue(this.produit!);
    }

    validateProduit() {
        this.submittedProduit = true;
        // stop here if form is invalid

        if (this.produitForm.invalid) {
            this.errorsProduit = [];
            this.errorsProduit = this.validationService.getFormValidationErrors(this.produitForm, this.champsProduit);
            this.notificationService.setNotification('danger', this.errorsProduit);
            return false;
        } else {
            return true;
        }
    }

    onSubmitProduit() {
        if (!this.validateProduit()) {
            return;
        }

        this.produit = {...this.produit, ...this.produitForm.value };

        if (this.id) {
            this.produitService.updateProduit(this.produit!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Produit mis à jour.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.produitService.createProduit(this.produitForm.value).subscribe((data) => {
                this.notificationService.setNotification('success', ['Produit créé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.produitForm.controls; }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
