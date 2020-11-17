import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PrelevementService} from '../prelevement.service';
import {Prelevement} from '../../processus/Prelevement';
import {
    EnumFractionFiltre,
    EnumStatutPrelevement,
    EnumTypePrelevement,
    ZoneIntervention
} from '@aleaac/shared';
import {NotificationService} from '../../notification/notification.service';
import {InterventionService} from '../../intervention/intervention.service';
import {Franchise} from '../../resource/franchise/franchise';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {ObjectifService} from '../../resource/objectif/objectif.service';
import {Objectif} from '../../resource/objectif/Objectif';
import {ChantierService} from '../../chantier/chantier.service';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../resource/validation/validation.service';

@Component({
    selector: 'app-prelevement',
    templateUrl: './prelevement.component.html',
    styleUrls: ['./prelevement.component.scss']
})
export class PrelevementComponent implements OnInit {
    @Input() modal: boolean = false;
    @Input() isNew: boolean = false;
    @Input() prelevement: Prelevement;
    @Input() idChantier: number;
    @Input() idParent: number;
    @Input() nomIdParent: string;
    @Input() redirectPath: (string | number)[];
    @Output() emitPrelevements = new EventEmitter<Prelevement[]>();
    enumStatutPrelevement = EnumStatutPrelevement;
    keysTypePrelevement: any;
    enumTypePrelevement = EnumTypePrelevement;
    keysFractionFiltre: any;
    enumFractionFiltre = EnumFractionFiltre;
    franchise: Franchise;
    objectifs: Objectif[];
    zonesIntervention: ZoneIntervention[];
    champsInformations: Map<string, string> = new Map<string, string>([
        ['reference', 'La référence'],
        ['idTypePrelevement', 'Le type de prélèvement'],
        ['objectif', 'l\'objectif'],
        ['zoneIntervention', 'La zone d\'intervention'],
        ['idFractionStrategie', 'La fraction à analyser'],
        ['saViseeStrategie', 'L\'objectif visé']
    ]);


    constructor(
        private route: ActivatedRoute,
        private prelevementService: PrelevementService,
        private notificationService: NotificationService,
        private interventionService: InterventionService,
        private franchiseService: FranchiseService,
        private router: Router,
        private objectifService: ObjectifService,
        private chantierService: ChantierService,
        private validationService: ValidationService
    ) {
    }

    ngOnInit() {
        this.keysTypePrelevement = Object.keys(this.enumTypePrelevement).filter(Number);
        this.keysFractionFiltre = Object.keys(this.enumFractionFiltre).filter(Number);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
        });
        this.objectifService.getAllObjectif().subscribe((objectifs) => {
            this.objectifs = objectifs;
        });
        if (this.isNew) {
            this.prelevement = new Prelevement();
            this.prelevement.idFractionStrategie = this.enumFractionFiltre['1/2'];
            this.prelevement.idFranchise = this.franchise.id;
            this.prelevement.idStatutPrelevement = this.enumStatutPrelevement.PLANIFIE;
            if (this.idChantier) {
                this.chantierService.getZI(this.idChantier).subscribe((zi) => {
                    this.zonesIntervention = zi;
                });
                this.prelevement.idChantier = this.idChantier;
                this.prelevement.isCreeApresStrategie = true;
            }
        } else {
            this.route.params.subscribe((params) => {
                this.prelevementService.get(params.idPrelevement).subscribe((prelevement) => {
                    if (this.idChantier) {
                        this.prelevement.idChantier = this.idChantier;
                    } else {
                        this.chantierService.getZI(prelevement.idChantier).subscribe((zi) => {
                            this.zonesIntervention = zi;
                        });
                    }
                });
            });
        }
    }

    valider(f) {
        if (f.form.valid) {
            this.prelevementService.create(this.prelevement).subscribe((prelevement) => {
                this.notificationService.setNotification('success', ['Prélèvement créé corectement']);
                if (this.modal) {
                    this.emitPrelevements.emit([prelevement]);
                } else {
                    this.router.navigate(['chantier', prelevement.idChantier, 'prelevement', 'liste']);
                }
            });
        } else {
            const erreur = this.validationService.getFormValidationErrors(f.form as FormGroup, this.champsInformations);
            this.notificationService.setNotification('danger', erreur);
        }
    }

}
