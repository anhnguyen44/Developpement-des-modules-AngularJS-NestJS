import { Franchise, ICivilite, IFranchise, GrilleTarif, Qualite, IFonction, TypeGrille, profils, TypeProduit } from '@aleaac/shared';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { GrilleTarifService } from '../../../resource/grille-tarif/grille-tarif.service';
import { TypeGrilleService } from '../../../resource/grille-tarif/type-grille.service';
import { NotificationService } from '../../../notification/notification.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { TarifDetail } from '../../../resource/tarif-detail/TarifDetail';


@Component({
    selector: 'app-grille-tarif-detail',
    templateUrl: './tarif-detail.component.html',
    styleUrls: ['./tarif-detail.component.scss']
})
export class GrilleTarifDetailComponent implements OnInit {
    @Input() superAdminId: number;
    compareFn = this._compareFn.bind(this);

    grilleTarif?: GrilleTarif;
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
    produitsParType: Array<Array<TarifDetail>> = new Array<Array<TarifDetail>>();

    lignesForm: FormGroup;
    items: FormArray;

    constructor(
        private menuService: MenuService,
        private grilleTarifService: GrilleTarifService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private routerService: Router,
        private typeGrilleService: TypeGrilleService
    ) {
        if (this.superAdminId !== undefined) {
            this.id = this.superAdminId;
            if (this.id) {
                this.grilleTarifService.getGrilleTarifById(this.id).subscribe((data) => {
                    this.grilleTarif = data;
                    console.log(data);
                    this.InitForms();
                    for (const categorie of this.grilleTarif!.typeGrille.categories) {
                        this.produitsParType[categorie.id] =
                            this.grilleTarif.details.filter(x => x.produit.idType === categorie.id);
                        this.addItem(categorie, this.produitsParType[categorie.id]);
                    }
                    console.log(this.lignesForm);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.grilleTarif = new GrilleTarif();
            }
        } else {
            this.route.params.subscribe(params => {
                this.id = params['id'];
                if (this.id) {
                    this.grilleTarifService.getGrilleTarifById(this.id).subscribe((data) => {
                        this.grilleTarif = data;
                        console.log(data);
                        this.InitForms();
                        for (const categorie of this.grilleTarif!.typeGrille.categories) {
                            this.produitsParType[categorie.id] =
                                this.grilleTarif.details.filter(x => x.produit.idType === categorie.id);
                            this.addItem(categorie, this.produitsParType[categorie.id]);
                        }
                        console.log(this.lignesForm);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.grilleTarif = new GrilleTarif();
                }
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

        this.lignesForm = this.formBuilder.group({
            items: this.formBuilder.array([])
        });
    }

    createItem(categorie: TypeProduit, items: TarifDetail[]): FormGroup {
        const tata = this.formBuilder.group({
            categorie: [categorie, null],
            lignes: this.formBuilder.array([])
        });

        for (const item of items) {
            const tutu = tata.get('lignes') as FormArray;
            tutu.push(this.formBuilder.group({
                id: [item.id, null],
                prixUnitaire: [item.prixUnitaire, Validators.required],
                tempsUnitaire: [item.tempsUnitaire, null],
                uniteTemps: [item.uniteTemps, null],
                produit: [item.produit, null]
            }, {
                    validators: [this.validationService.RequireIf('tempsUnitaire', item.produit.hasTemps),
                    this.validationService.RequireIf('uniteTemps', item.produit.hasTemps)]
                }));
        }

        return tata;
    }

    addItem(categorie: TypeProduit, items: TarifDetail[]): void {
        this.items = this.lignesForm.get('items') as FormArray;
        this.items.push(this.createItem(categorie, items));
    }

    async ngOnInit() {
        if (this.superAdminId === undefined) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Grilles tarif', '/parametrage/grilleTarif/liste'],
                ['Détails', '']
            ]);
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

        this.grilleTarif!.details = [];
        for (const itemGrp of (<FormArray>this.lignesForm.get('items')!).controls) {
            for (const toto of itemGrp.value.lignes) {
                delete toto.produit;
                toto.prixUnitaire = Number.parseFloat(toto.prixUnitaire);
                this.grilleTarif!.details.push(toto);
            }
        }

        if (this.id) {
            this.grilleTarifService.updateGrilleTarif(this.grilleTarif!).subscribe(() => {
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
