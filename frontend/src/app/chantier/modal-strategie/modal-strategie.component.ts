import { BesoinClientLabo, Strategie, Objectif, InfosBesoinClientLabo, EnumTypeStrategie, EnumStatutStrategie } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { Franchise } from '../../resource/franchise/franchise';
import { MomentObjectif } from '@aleaac/shared';
import { MomentObjectifService } from '../../resource/objectif/moment-objectif.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ObjectifService } from '../../resource/objectif/objectif.service';
import { ActivatedRoute } from '@angular/router';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { EnumSousSectionStrategie } from '@aleaac/shared';
import { EnumTypeBesoinLabo } from '@aleaac/shared';
import { EnumMomentObjectifs } from '@aleaac/shared';

@Component({
    selector: 'app-modal-strategie',
    templateUrl: './modal-strategie.component.html',
    styleUrls: ['./modal-strategie.component.scss']
})
export class ModalStrategieComponent implements OnInit {
    @Input() infos: BesoinClientLabo;
    @Input() sousSection: EnumSousSectionStrategie;
    @Input() nextNumber: number = 0; // Donne le nb par défaut pour la ref de la stratégie (on a forcément le nombre en page parente)

    @Input() strategie: Strategie = new Strategie();

    @Output() emitStrategie = new EventEmitter<Strategie>();
    @Output() emitClose = new EventEmitter();
    listeMoments: MomentObjectif[];
    listeMomentsSpatiale: MomentObjectif[] = new Array<MomentObjectif>();
    listeMomentsSuivi: MomentObjectif[] = new Array<MomentObjectif>();
    listeMomentsChoisis: MomentObjectif[] = new Array<MomentObjectif>();
    typeStrategie: string = 'SPATIALE';

    listeObjectifs: Objectif[];
    objectifsDisponibles: Objectif[];
    idChantier: number;

    rechercheString: string;
    franchise: Franchise;
    loading: boolean;
    submitted: boolean = false;

    formMoments: FormGroup;

    constructor(
        private notificationService: NotificationService,
        private momentObjectifService: MomentObjectifService,
        private strategieService: StrategieService,
        private objectifService: ObjectifService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.idChantier = params.id;
            if (!this.strategie.id && this.nextNumber) {
                this.strategie.reference = 'STR-' + this.idChantier + '-' + this.nextNumber;
            }
        });
        this.formMoments = this.formBuilder.group({
            UTILISATION_NORMALE_LOCAUX: [null, null],
            SUITE_A_INCIDENT: [null, null],
            AVANT_TRAVAUX_LIES_AMIANTE: [null, null],
            PENDANT_TRAVAUX_PRELIM_PREPA: [null, null],
            PENDANT_TRAVAUX_INTERV_LIES_AMIANTE: [null, null],
            FIN_TRAVAUX_RETRAIT_ENCAPSULAGE: [null, null],
            FIN_INTERVENTION_EMISSION_FIBRES: [null, null],
            ISSUE_TRAVAUX_RETRAIT_ENCAPSULAGE: [null, null],
        });

        this.momentObjectifService.getAll().subscribe(data => {
            this.listeMoments = data;

            for (const moment of this.listeMoments) {
                if (moment.typeStrategie) {
                    if (moment!.typeStrategie! === EnumTypeStrategie.SPATIALE) {
                        this.listeMomentsSpatiale.push(moment);
                    }
                    if (moment!.typeStrategie! === EnumTypeStrategie.SUIVI) {
                        this.listeMomentsSuivi.push(moment);
                    }
                }
            }

            if (this.strategie.id && this.strategie.moments && this.strategie.moments.length > 0) {
                this.typeStrategie = this.strategie.typeStrategie.toString();
                for (const mome of this.strategie.moments) {
                    this.formMoments.get(mome.code)!.setValue(true);
                }
            }
        });

        this.objectifService.getAllObjectif().subscribe(objectifs => {
            this.listeObjectifs = objectifs;
            // if (this.infos) {
            //     this.listeObjectifs =
            //         this.listeObjectifs.filter(o => o.idType === null || o.idType === this.infos.idTypeBesoinLabo.valueOf());
            // }
        });
    }

    nbPhaseSelected(): number {
        let nbSelected: number = 0;
        this.listeMomentsChoisis = new Array<MomentObjectif>();
        if (this.typeStrategie === 'SPATIALE' || this.typeStrategie === 'AUTRE') {
            this.listeMomentsSpatiale.forEach(momentSp => {
                if (this.formMoments.get(momentSp.code)!.value === true) {
                    nbSelected++;
                    this.listeMomentsChoisis.push(momentSp);
                }
            });
        }
        if (this.typeStrategie === 'SUIVI' || this.typeStrategie === 'AUTRE') {
            this.listeMomentsSuivi.forEach(momentSu => {
                if (this.formMoments.get(momentSu.code)!.value === true) {
                    nbSelected++;
                    this.listeMomentsChoisis.push(momentSu);
                }
            });
        }

        return nbSelected;
    }

    setObjectifsToDisplay() {
        this.objectifsDisponibles = new Array<Objectif>();

        if (this.typeStrategie === 'SPATIALE' || this.typeStrategie === 'AUTRE') {
            this.listeMomentsSpatiale.forEach(momentSp => {
                if (this.formMoments.get(momentSp.code)!.value === true) {
                    for (const obj of this.listeObjectifs) {
                        if (obj.idMomentObjectif === momentSp.id) {
                            this.objectifsDisponibles.push(obj);
                        }
                    }
                }
            });

            // On décoche les suivi si 'SPATIALE'
            if (this.typeStrategie === 'SPATIALE') {
                this.listeMomentsSuivi.forEach(momentSu => {
                    this.formMoments.get(momentSu.code)!.setValue(false);
                });
            }
        }
        if (this.typeStrategie === 'SUIVI' || this.typeStrategie === 'AUTRE') {
            this.listeMomentsSuivi.forEach(momentSu => {
                if (this.formMoments.get(momentSu.code)!.value === true) {
                    for (const obj of this.listeObjectifs) {
                        if (obj.idMomentObjectif === momentSu.id) {
                            this.objectifsDisponibles.push(obj);
                        }
                    }
                }
            });

            // On décoche les spatiale si 'SUIVI'
            if (this.typeStrategie === 'SUIVI') {
                this.listeMomentsSpatiale.forEach(momentSp => {
                    this.formMoments.get(momentSp.code)!.setValue(false);
                });
            }
        }
    }

    close(event: any) {
        if (!event || !event.srcElement || (event.srcElement!.classList[0] !== 'link' && event.srcElement!.classList[0] !== 'button')) {
            this.emitClose.emit();
        }
    }

    onSubmit() {
        this.submitted = true;
        // Si valide
        if (this.typeStrategie && this.listeMomentsChoisis.length > 0 && this.strategie.reference.length > 0) {
            // On patch les valeurs
            switch (this.typeStrategie) {
                case 'SPATIALE':
                    this.strategie.typeStrategie = EnumTypeStrategie.SPATIALE;
                    break;
                case 'SUIVI':
                    this.strategie.typeStrategie = EnumTypeStrategie.SUIVI;
                    break;
                case 'AUTRE':
                    this.strategie.typeStrategie = EnumTypeStrategie.AUTRE;
                    break;
                default:
                    this.strategie.typeStrategie = EnumTypeStrategie.AUTRE;
                    break;
            }

            this.strategie.moments = this.listeMomentsChoisis;
            if (!this.strategie.id) {
                this.strategie.idChantier = this.idChantier;
                this.strategie.isCOFRAC = true;
                this.strategie.version = 1;
                if (this.infos.idTypeBesoinLabo === 2) {
                    this.strategie.sousSection = null;
                } else {
                    this.strategie.sousSection = this.sousSection;
                }
                this.strategie.statut = EnumStatutStrategie.STRAT_A_REALISER;
            }


            this.strategie.description = '';
            let i = 0;
            for (const mom of this.listeMomentsChoisis) {
                this.strategie.description += mom.nom;
                i++;
                if (i < this.listeMomentsChoisis.length) {
                    this.strategie.description += ', ';
                }
            }

            // Si la stratégie existe déjà, update
            if (this.strategie && this.strategie.id) {
                this.strategieService.updateStrategie(this.strategie).subscribe((strategie) => {
                    this.emitStrategie.emit(this.strategie);
                    this.notificationService.setNotification('success', ['Stratégie mise à jour.']);
                    this.emitClose.emit();
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.strategieService.createStrategie(this.strategie).subscribe((strategie) => {
                    this.strategie.id = strategie.id;
                    this.emitStrategie.emit(strategie);
                    this.notificationService.setNotification('success', ['Stratégie créée.']);
                    this.emitClose.emit();
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }

        } else {
            const erreur: string[] = ['Le type, la référence et au moins une phase doivent être définis.'];
            this.notificationService.setNotification('danger', erreur);
        }
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close(event);
    }
}
