import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../../menu/menu.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BureauService } from '../bureau.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bureau } from '../Bureau';
import { Adresse } from '../Adresse';
import { ValidationService } from '../../../resource/validation/validation.service';
import { NotificationService } from '../../../notification/notification.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import { CodePostal } from '@aleaac/shared';
import { format } from 'date-fns';

@Component({
    selector: 'app-bureau',
    templateUrl: './bureau.component.html',
    styleUrls: ['./bureau.component.scss']
})
export class BureauComponent implements OnInit {
    submited: boolean = false;
    bureau: Bureau;
    @Input() superAdminFranchiseId: number;
    @Input() superAdminId: number;
    adresseFrom = this.formBuilder.group({
        adresse: ['', [Validators.required]],
        complement: [''],
        cp: ['', [Validators.required]],
        ville: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required]],
        fax: [''],
    });
    bureauForm = this.formBuilder.group({
        nom: ['', [Validators.required]],
        bPrincipal: [''],
        portable: [''],
        adresse: this.adresseFrom,
        numeroAccreditation: [],
        dateValiditeAccreditation: [],
        nomCommercial: []
    });

    champsInformations: Map<string, string> = new Map<string, string>([
        ['nom', 'Le nom du bureau'],
        ['telephone', 'Le téléphone'],
        ['email', 'l\'adresse email'],
        ['ville', 'la ville'],
        ['telephone', 'le téléphone']
    ]);

    constructor(
        private route: ActivatedRoute,
        private menuService: MenuService,
        private formBuilder: FormBuilder,
        private bureauService: BureauService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private userService: UserService,
        private userStore: UserStore
    ) { }

    ngOnInit() {
        if (!this.superAdminId && !this.superAdminFranchiseId) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Agences', '/parametrage/bureau'],
                ['Informations', '']
            ]);
        }

        if (this.superAdminId) {
            this.bureauService.getById(this.superAdminId).subscribe((bureau) => {
                this.bureau = bureau;
                this.bureauForm.patchValue(this.bureau);
                this.bureauForm.patchValue({
                    dateValiditeAccreditation: format(this.bureau.dateValiditeAccreditation, 'YYYY-MM-DD')
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.route.params.subscribe((params) => {
                if (params.id) {
                    this.bureauService.getById(params.id).subscribe((bureau) => {
                        this.bureau = bureau;
                        this.bureauForm.patchValue(this.bureau);
                        this.bureauForm.patchValue({
                            dateValiditeAccreditation: format(this.bureau.dateValiditeAccreditation, 'YYYY-MM-DD')
                        });
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.bureau = new Bureau();
                    this.bureau.adresse = new Adresse();
                    this.bureauForm.patchValue(this.bureau);
                    this.bureauForm.patchValue({
                        dateValiditeAccreditation: format(this.bureau.dateValiditeAccreditation, 'YYYY-MM-DD')
                    });
                }
                if (params.superAdminFranchiseId) {
                    this.superAdminFranchiseId = params.superAdminFranchiseId;
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    public onSubmit({ value, valid }: { value: Bureau, valid: boolean }) {
        const currentModule = this.superAdminId || this.superAdminFranchiseId ? 'superadmin' : 'parametrage';
        if (valid) {
            if (this.bureau.id) {
                value.id = this.bureau.id;
                value.idFranchise = this.bureau.idFranchise;
                if (this.bureau.adresse && this.bureau.adresse.id) {
                    value.adresse.id = this.bureau.adresse.id;
                }
                this.bureauService.update(value).subscribe((data) => {
                    this.notificationService.setNotification('success', ['Bureau mis à jour correctement.']);
                    if (this.superAdminId || this.superAdminFranchiseId) {
                        this.router.navigate(['/' + currentModule + '/bureau/liste/' + value.idFranchise]);
                    } else {
                        this.router.navigate(['/' + currentModule + '/bureau']);
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {

                if (this.superAdminFranchiseId) {
                    value.idFranchise = this.superAdminFranchiseId;
                    this.bureauService.create(value).subscribe((data) => {
                        this.notificationService.setNotification('success', ['Bureau créé correctement.']);
                        this.router.navigate(['/' + currentModule + '/bureau/liste/' + this.superAdminFranchiseId]);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    this.franchiseService.franchise.subscribe((franchise) => {
                        value.idFranchise = franchise.id;
                        this.bureauService.create(value).subscribe((data) => {
                            this.notificationService.setNotification('success', ['Bureau créé correctement.']);
                            this.router.navigate(['/' + currentModule + '/bureau']);
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
        } else {
            this.submited = true;
            const erreurs = this.validationService.getFormValidationErrors(this.bureauForm, this.champsInformations)
                .concat(this.validationService.getFormValidationErrors(this.adresseFrom, this.champsInformations));
            this.notificationService.setNotification('danger', erreurs);
        }
    }

    setCP(cpVille: CodePostal) {
        if (cpVille) {
            this.adresseFrom.controls['cp'].setValue(cpVille.numCP);
            this.adresseFrom.controls['ville'].setValue(cpVille.nomCommune);
        }
    }
}
