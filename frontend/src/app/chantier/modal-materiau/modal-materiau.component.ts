import { MateriauZone, Liste, MateriauConstructionAmiante, EnumResultatExamenAmiante, EnumListeMateriauxAmiante,
    EnumEtatDegradation, EnumEtendueDegradation, EnumProtection, EnumEtancheite } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { Franchise } from '../../resource/franchise/franchise';
import { MomentObjectif } from '@aleaac/shared';
import { MomentObjectifService } from '../../resource/objectif/moment-objectif.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ObjectifService } from '../../resource/objectif/objectif.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriauZoneService } from '../../resource/materiau-construction-amiante/materiau-zone.service';
import { ListeService } from '../../resource/liste/liste.service';
import { ValidationService } from '../../resource/validation/validation.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';

@Component({
    selector: 'app-modal-materiau-zone',
    templateUrl: './modal-materiau.component.html',
    styleUrls: ['./modal-materiau.component.scss']
})
export class ModalMateriauZoneComponent implements OnInit {
    @Input() materiauZone: MateriauZone = new MateriauZone();
    @Input() canEdit: boolean = true;
    @Input() informationsIsNC: boolean = false;

    @Output() emitMateriauZone = new EventEmitter<MateriauZone>();
    @Output() emitClose = new EventEmitter();

    idChantier: number;
    idStrategie: number;
    idZone: number;
    idMateriauZone: number;

    franchise: Franchise;
    loading: boolean;

    isPatchValueDone: boolean = true;
    shouldEtacheiteEdit: boolean = true;
    informationsForm: FormGroup;
    errorsInformations: string[] = new Array<string>();
    submittedInformations: boolean = false;

    enumResultatExamenAmiante: typeof EnumResultatExamenAmiante = EnumResultatExamenAmiante;
    enumListeMateriau: typeof EnumListeMateriauxAmiante = EnumListeMateriauxAmiante;

    champsInformations: Map<string, string> = new Map<string, string>([
        ['reference', 'La référence'],
        ['libelle', 'Le libellé'],
        ['descriptif', 'Le descriptif'],
        ['statut', 'Le statut d\'occupation'],
        ['batiment', 'Le bâtiment'],
        ['isZoneDefinieAlea', 'La définition de la zone par AléaContrôles'],
        ['isSousAccreditation', 'Le fait que la zone soit sous accréditation'],
        ['commentaire', 'Le commentaire'],
    ]);

    listeEtatDegradation: Liste[];
    listeEtendueDegradation: Liste[];
    listeCommentaireDegradation: Liste[];
    listeProtection: Liste[];
    listeEtancheite: Liste[];
    listeCommentaireProtectionEtancheite: Liste[];

    enumEtatDegradation: typeof EnumEtatDegradation = EnumEtatDegradation;
    enumEtendueDegradation: typeof EnumEtendueDegradation = EnumEtendueDegradation;
    enumProtection: typeof EnumProtection = EnumProtection;
    enumEtancheite: typeof EnumEtancheite = EnumEtancheite;

    constructor(
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private materiauZoneService: MateriauZoneService,
        private listeService: ListeService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private franchiseService: FranchiseService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.idChantier = params.id;
            this.idStrategie = params.idStrategie;
            this.idZone = params.idZone;
        });
        this.informationsForm = this.formBuilder.group({
            etatDegradation: [null, Validators.required],
            etendueDegradation: [null, Validators.required],
            commentaireDegradation: [null, null],
            moyenProtection: [null, Validators.required],
            etancheiteProtection: [null, null],
            commentaireProtection: [null, null],
            resultatConnu: [null, null],
        });

        if (!this.canEdit) {
            this.informationsForm.disable();
        }

        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        if (this.materiauZone && this.materiauZone.id) {
            this.informationsIsNC = this.materiauZone.isInfosNC;
            this.informationsForm.patchValue(this.materiauZone);
            this.onChangeProtection();
        }
    }

    onChangeNC(truc: boolean) {
        this.materiauZone.isInfosNC = truc;
        this.informationsIsNC = truc;
    }

    onChangeProtection() {
        this.shouldEtacheiteEdit = Number.parseInt(this.informationsForm.controls.moyenProtection.value) !== EnumProtection.Aucune
                                    && this.canEdit;
        if (this.shouldEtacheiteEdit) {
            this.informationsForm.controls.etancheiteProtection.enable();
        } else {
            this.materiauZone.etancheiteProtection = EnumEtancheite.NON_APPLICABLE;
            this.informationsForm.controls.etancheiteProtection.setValue(EnumEtancheite.NON_APPLICABLE);
            this.informationsForm.controls.etancheiteProtection.disable();
        }
    }

    close(event) {
        if (!event || !event.srcElement
            || (event.srcElement!.classList[0] !== 'link'
                && event.srcElement!.classList[0] !== 'button'
                && event.srcElement!.classList[0] !== 'sub')
            ) {
            this.emitClose.emit();
        }
    }

    onSubmit() {
        this.submittedInformations = true;
        // Si valide
        let doNotContinue = false;

        if (!this!.validateInformations()) {
            doNotContinue = true;
            this.validateAllFields(this.informationsForm);
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations);
            return;
        }

        this.materiauZone = { ...this.materiauZone, ...this.informationsForm.value };
        if (this.materiauZone.materiau) {
            this.materiauZone.idMateriau = this.materiauZone.materiau.id;
            delete this.materiauZone.materiau;
        }

        if (this.idMateriauZone) {
            this.materiauZoneService.updateMateriauZone(this.materiauZone!).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            doNotContinue = false;

            if (!this!.validateInformations()) {
                doNotContinue = true;
            }

            if (doNotContinue === true) {
                this.notificationService.setNotification('danger', this.errorsInformations);
                return;
            }
            this.materiauZone = { ...this.materiauZone, ...this.informationsForm.value };
            this.materiauZone.idZoneIntervention = this.idZone;

            this.materiauZoneService.createMateriauZone(this.materiauZone!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Matériau ajouté à la zone.']);
                // const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                // this.routerService.navigate([moduleToUse + '/utilisateur/modifier', data.id]);
                this.idMateriauZone = data.id;
                this.materiauZone.id = data.id;
                this.emitMateriauZone.emit(this.materiauZone);
                this.emitClose.emit();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }


        // Save Item commentaire etat dégradation
        if (this.informationsForm.get('commentaireDegradation')!.value
        && this.informationsForm.get('commentaireDegradation')!.value.length > 0) {
            this.listeService.createIfNeeded(this.informationsForm.get('commentaireDegradation')!.value
                                            , this.listeCommentaireDegradation, this.franchise.id)
                .subscribe((data) => {
                    if (data) {
                        if (this.listeCommentaireDegradation.findIndex(l => l.valeur === data.valeur) === -1) {
                            this.listeCommentaireDegradation.push(data);
                        }
                    }

                    console.log('Item enregistré');
                    this.notificationService.setNotification('success', ['Item enregistré.']);
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
        }

        // Save Item commentaire protection / étanchéité
        if (this.informationsForm.get('commentaireProtection')!.value
            && this.informationsForm.get('commentaireProtection')!.value.length > 0) {
            this.listeService.createIfNeeded(this.informationsForm.get('commentaireProtection')!.value
                                            , this.listeCommentaireProtectionEtancheite, this.franchise.id)
                .subscribe((data) => {
                    if (data) {
                        if (this.listeCommentaireProtectionEtancheite.findIndex(l => l.valeur === data.valeur) === -1) {
                            this.listeCommentaireProtectionEtancheite.push(data);
                        }
                    }

                    console.log('Item enregistré');
                    this.notificationService.setNotification('success', ['Item enregistré.']);
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
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

    setMateriau(materiau: MateriauConstructionAmiante) {
        console.log(materiau);
        this.materiauZone.idMateriau = materiau.id;
        this.materiauZone.materiau = materiau;
        this.materiauZone.materiauAutre = null;
    }

    setMateriauAutre(materiau: Liste) {
        console.log(materiau);
        this.materiauZone.idMateriau = null;
        this.materiauZone.materiau = null;
        this.materiauZone.materiauAutre = materiau.valeur;
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close(event);
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }

    compareEnum(a, b) {
        return a && b ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf()
                        || a === b.valueOf() || a.valueOf() === b) : false;
    }
}
