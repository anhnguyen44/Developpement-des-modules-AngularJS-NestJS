import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { ProcessusZone, EnumEmpoussierementGeneral, EnumAppareilsProtectionRespiratoire, TypeBatiment, GES } from '@aleaac/shared';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProcessusZoneService } from '../../resource/processus-zone/processus-zone.service';
import { ProcessusService } from '../../processus/processus.service';
import { EnumTypeDeChantier } from '@aleaac/shared/src/models/processus-zone.model';
import { ValidationService } from '../../resource/validation/validation.service';
import { ChantierService } from '../chantier.service';
import { ActivatedRoute } from '@angular/router';
import { Chantier } from '@aleaac/shared/src/models/chantier.model';
import { Processus } from '../../processus/Processus';
import { EnumTypeBatiments } from '@aleaac/shared/src/models/type-batiment.model';
import { Mpca } from '../../processus/Mpca';
import { OutilTechnique } from '../../processus/OutilTechnique';
import { TravailHumide } from '../../processus/TravailHumide';
import { CaptageAspirationSource } from '../../processus/CaptageAspirationSource';
import { MpcaService } from '../../processus/mpca.service';
import { TypeBatimentService } from '../../resource/type-batiment/type-batiment.service';
import { OutilTechniqueService } from '../../processus/outil-technique.service';
import { TravailHumideService } from '../../processus/travail-humide.service';
import { CaptageAspirationSourceService } from '../../processus/captage-aspiration-source.service';
import { CalendarUtils } from 'angular-calendar';
import { GESService } from '../../resource/processus-zone/ges.service';
import { EnumPhaseOperationnelle } from '@aleaac/shared/src/models/ges.model';
import { TacheProcessus } from '../../processus/TacheProcessus';
import { EnumTypeAnalysePrelevement } from '@aleaac/shared';

@Component({
    selector: 'app-modal-processus-zone',
    templateUrl: './modal-processus-zone.component.html',
    styleUrls: ['./modal-processus-zone.component.scss']
})
export class ModalProcessusZoneComponent implements OnInit {
    @Input() processusZone: ProcessusZone = new ProcessusZone();
    @Input() idZone: number;
    @Input() canEdit: boolean = true;
    idProcessusZone: number;
    chantier: Chantier;
    listeProcessus: Processus[];
    @Output() emitProcessusZone = new EventEmitter<ProcessusZone>();
    @Output() emitClose = new EventEmitter();

    informationsForm: FormGroup;
    errorsInformations: string[] = new Array<string>();
    submittedInformations: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([
        ['idProcessus', 'Le processus'],
        ['idEmpoussierementGeneralAttendu', 'L\'empoussièrement général attendu'],
        ['idAppareilsProtectionRespiratoire', 'L\'appreil de protection respiratoire'],
        ['typeChantier', 'La phase'],
        ['nombreVacationsJour', 'Le nombre de vacations par jour'],
        ['nombreOperateurs', 'Le nombre d\'opérateurs présents en zone'],
    ]);

    enumEmpoussierementGeneral: typeof EnumEmpoussierementGeneral = EnumEmpoussierementGeneral;
    enumAppareilsProtectionRespiratoire: typeof EnumAppareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire;
    enumTypeChantier: typeof EnumTypeDeChantier = EnumTypeDeChantier;
    enumTypeAnalysePrelevement: typeof EnumTypeAnalysePrelevement = EnumTypeAnalysePrelevement;

    listMpca: Mpca[];
    currentMPCA: Mpca;
    listTypeBatiment: TypeBatiment[];
    currentTypeBatiment: TypeBatiment;
    listOutilTechnique: OutilTechnique[];
    currentOutilTechnique: OutilTechnique;
    listTravailHumide: TravailHumide[];
    currentTravailHumide: TravailHumide;
    listCaptageAspirationSource: CaptageAspirationSource[];
    currentCaptageAspirationSource: CaptageAspirationSource;

    openModalProcessus: boolean = false;
    afficheGES: boolean = true;


    listeTachesInstallation: TacheProcessus[] = new Array<TacheProcessus>();
    listeTachesRetrait: TacheProcessus[] = new Array<TacheProcessus>();
    listeTachesRepli: TacheProcessus[] = new Array<TacheProcessus>();

    constructor(
        private chantierService: ChantierService,
        private processusService: ProcessusService,
        private processusZoneService: ProcessusZoneService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private mpcaService: MpcaService,
        private gesService: GESService,
        private typeBatimentService: TypeBatimentService,
        private outilTechniqueService: OutilTechniqueService,
        private travailHumideService: TravailHumideService,
        private captageAspirationSourceService: CaptageAspirationSourceService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.informationsForm = this.formBuilder.group({
            processus: [null, Validators.required],
            idEmpoussierementGeneralAttendu: ['4', Validators.required],
            idAppareilsProtectionRespiratoire: ['1', Validators.required],
            typeChantier: ['0', Validators.required],
            nombreVacationsJour: [1, Validators.required],
            nombreOperateurs: [1, Validators.required],
            tsatP: [, Validators.required],
            tr: [, Validators.required],
            nombreJours: [, Validators.required],
            dureeSequence: [, Validators.required],
            typeAnalyse: [EnumTypeAnalysePrelevement.CONJOINT, Validators.required],
        });

        if (!this.canEdit) {
            this.informationsForm.disable();
        }

        this.informationsForm.controls['processus'].valueChanges.subscribe((value) => {
            console.log(value);

            if (!this.processusZone.listeGES
                || this.processusZone.listeGES.length === 0
                || value.id === this.processusZone.idProcessus
                || (value.id !== this.processusZone.idProcessus
                    && confirm('Êtes-vous sûr de vouloir changer de processus ? (Les GES créés seront perdues)'))
            ) {
                // Si on change de processus, faut péter les GES
                if (value.id !== this.processusZone.idProcessus) {
                    if (this.processusZone.listeGES && this.processusZone.listeGES.length) {
                        let i = 0;
                        for (const ges of this.processusZone.listeGES) {
                            this.gesService.removeGES(ges.id).subscribe(() => {
                                i++;
                                if (i >= this.processusZone.listeGES.length) {
                                    this.processusZone.listeGES = new Array<GES>();
                                    // On recharge le composant GES
                                    this.afficheGES = false;
                                    if (false) {
                                        // TODO : confirm si GES existe puis suppression
                                    }
                                    setTimeout(() => {
                                        this.afficheGES = true;
                                    }, 10);
                                }
                            });
                        }
                    } else {
                        this.afficheGES = false;
                        setTimeout(() => {
                            this.afficheGES = true;
                        }, 10);
                    }
                }

                const process = value as Processus;

                if (process && process.id) {
                    this.processusZone.idProcessus = process.id;

                    this.listeTachesInstallation = new Array<TacheProcessus>();
                    this.listeTachesRetrait = new Array<TacheProcessus>();
                    this.listeTachesRepli = new Array<TacheProcessus>();
                    if (process.tachesInstallation && process.tachesInstallation.length) {
                        process.tachesInstallation.forEach(ptp => {
                            this.listeTachesInstallation.push(ptp);
                        });
                    }

                    if (process.tachesRetrait && process.tachesRetrait.length) {
                        process.tachesRetrait.forEach(pts => {
                            this.listeTachesRetrait.push(pts);
                        });
                    }

                    if (process.tachesRepli && process.tachesRepli.length) {
                        process.tachesRepli.forEach(ptr => {
                            this.listeTachesRepli.push(ptr);
                        });
                    }

                    this.processusZone.processus = process;
                }

                // Pour affichage détails
                if (!this.listMpca) {
                    this.mpcaService.getAll().subscribe((mpca) => {
                        this.listMpca = mpca;
                        this.currentMPCA = this.listMpca.find(m => m.id === process.idMpca
                            || m.id.toString() === process.idMpca.toString())!;
                    });
                } else {
                    this.currentMPCA = this.listMpca.find(m => m.id === process.idMpca || m.id.toString() === process.idMpca.toString())!;
                }

                if (!this.listTypeBatiment) {
                    this.typeBatimentService.getAllTypeBatiment().subscribe((typeBatiment) => {
                        this.listTypeBatiment = typeBatiment;
                        this.currentTypeBatiment = this.listTypeBatiment.find(tb => tb.id === process.idTypeBatiment
                            || tb.id.toString() === process.idTypeBatiment.toString())!;
                    });
                } else {
                    this.currentTypeBatiment = this.listTypeBatiment.find(tb => tb.id === process.idTypeBatiment
                        || tb.id.toString() === process.idTypeBatiment.toString())!;
                }

                if (!this.listOutilTechnique) {
                    this.outilTechniqueService.getAll().subscribe((outilTechnique) => {
                        this.listOutilTechnique = outilTechnique;
                        this.currentOutilTechnique = this.listOutilTechnique.find(ot => ot.id === process.idOutilTechnique
                            || ot.id.toString() === process.idOutilTechnique.toString())!;
                    });
                } else {
                    this.currentOutilTechnique = this.listOutilTechnique.find(ot => ot.id === process.idOutilTechnique
                        || ot.id.toString() === process.idOutilTechnique.toString())!;
                }

                if (!this.listTravailHumide) {
                    this.travailHumideService.getAll().subscribe((travailHumide) => {
                        this.listTravailHumide = travailHumide;
                        this.currentTravailHumide = this.listTravailHumide.find(th => th.id === process.idTravailHumide
                            || th.id.toString() === process.idTravailHumide.toString())!;
                    });
                } else {
                    this.currentTravailHumide = this.listTravailHumide.find(th => th.id === process.idTravailHumide
                        || th.id.toString() === process.idTravailHumide.toString())!;
                }

                if (!this.listCaptageAspirationSource) {
                    this.captageAspirationSourceService.getAll().subscribe((captageAspirationSource) => {
                        this.listCaptageAspirationSource = captageAspirationSource;
                        this.currentCaptageAspirationSource =
                            this.listCaptageAspirationSource.find(cas => cas.id === process.idCaptageAspirationSource
                                || cas.id.toString() === process.idCaptageAspirationSource.toString())!;
                    });
                } else {
                    this.currentCaptageAspirationSource =
                        this.listCaptageAspirationSource.find(cas => cas.id === process.idCaptageAspirationSource
                            || cas.id.toString() === process.idCaptageAspirationSource.toString())!;
                }

                // On recharge le composant GES
                this.afficheGES = false;
                if (false) {
                    // TODO : confirm si GES existe puis suppression
                }
                setTimeout(() => {
                    this.afficheGES = true;
                }, 10);
            }
        });

        if (this.processusZone.id) {
            this.idProcessusZone = this.processusZone.id;
            this.informationsForm.patchValue(this.processusZone);

            this.listeTachesInstallation = new Array<TacheProcessus>();
            this.listeTachesRetrait = new Array<TacheProcessus>();
            this.listeTachesRepli = new Array<TacheProcessus>();
            if (this.processusZone.processus.tachesInstallation && this.processusZone.processus.tachesInstallation.length) {
                this.processusZone.processus.tachesInstallation.forEach(ptp => {
                    this.listeTachesInstallation.push(ptp);
                });
            }

            if (this.processusZone.processus.tachesRetrait && this.processusZone.processus.tachesRetrait.length) {
                this.processusZone.processus.tachesRetrait.forEach(pts => {
                    this.listeTachesRetrait.push(pts);
                });
            }

            if (this.processusZone.processus.tachesRepli && this.processusZone.processus.tachesRepli.length) {
                this.processusZone.processus.tachesRepli.forEach(ptr => {
                    this.listeTachesRepli.push(ptr);
                });
            }
        } else {
            this.processusZone.idZoneIntervention = this.idZone;
        }

        this.route.params.subscribe(params => {
            if (params.id) {
                // si on a un idChantier
                this.chantierService.get(params.id).subscribe(chantier => {
                    console.log(chantier);
                    if (chantier) {
                        this.chantier = chantier;
                        if (chantier.client.compteContacts.idCompte) {
                            this.processusService.getAll(chantier.client.compteContacts.idCompte, '').subscribe(res => {
                                this.listeProcessus = res;
                            });
                        }
                    }
                });
            }
        }, err => {
            console.error(err);
        });
    }

    setProcessusZone(processusZone: ProcessusZone) {
        this.emitProcessusZone.emit(processusZone);
    }

    setContact(contact) {
        console.log(contact);
        this.emitProcessusZone.emit(contact);
    }

    addProcessus(processus: Processus) {
        this.listeProcessus.push(processus);
        this.openModalProcessus = false;
        this.processusZone.processus = processus;
        this.processusZone.idProcessus = processus.id;
        this.informationsForm.get('processus')!.setValue(processus);
    }

    close(event) {
        if (!event || !event.srcElement
            || (event.srcElement!.classList[0] !== 'link'
                && event.srcElement!.classList[0] !== 'button'
                && event.srcElement!.classList[0] !== 'sub'
                && event.srcElement!.classList[0] !== 'selection-tache'
                && event.srcElement!.classList[0] !== 'liste-tache'
                && event.srcElement!.classList[0] !== 'tache'
                && event.srcElement!.classList[0] !== 'ng-pristine'
                && event.srcElement!.classList[0] !== 'ng-valid'
                && event.srcElement!.classList[0] !== 'ng-invalid'
                && event.srcElement!.classList[0] !== 'ng-touched'
                && event.srcElement!.classList[0] !== 'ng-untouched'
                && event.srcElement!.classList[0] !== 'formgroup'
                && event.srcElement!.classList[0] !== 'bloc'
            )
        ) {
            this.emitClose.emit();
        }
    }

    setListeGES(listeGES: GES[]) {
        this.processusZone.listeGES = listeGES;

        // Si on a juste ouvert le composant mais rien saisi, on dégage le truc
        if (this.processusZone.listeGES.length === 1
            && this.processusZone.listeGES[0].nom === ''
            && (!this.processusZone.listeGES[0].taches || this.processusZone.listeGES[0].taches.length === 0)
        ) {
            this.processusZone.listeGES = new Array<GES>();
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

        this.processusZone = { ...this.processusZone, ...this.informationsForm.value };
        if (this.processusZone.processus) {
            this.processusZone.idProcessus = this.processusZone.processus.id;
            delete this.processusZone.processus;
        }

        if (this.idProcessusZone) {
            this.processusZoneService.updateProcessusZone(this.processusZone!).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour.']);
                this.emitProcessusZone.emit(this.processusZone);
                this.emitClose.emit();
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
            this.processusZone = { ...this.processusZone, ...this.informationsForm.value };
            this.processusZone.idZoneIntervention = this.idZone;

            this.processusZoneService.createProcessusZone(this.processusZone!).subscribe((data) => {
                this.notificationService.setNotification('success', ['Matériau ajouté à la zone.']);
                // const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                // this.routerService.navigate([moduleToUse + '/utilisateur/modifier', data.id]);
                this.idProcessusZone = data.id;
                this.processusZone.id = data.id;
                this.emitProcessusZone.emit(this.processusZone);
                this.emitClose.emit();
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

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.emitClose.emit();
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }

    compareEnum(a, b) {
        return a && b ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf()) : false;
    }

    compare(a, b) {
        return a && b ? a.id === b.id : false;
    }
}
