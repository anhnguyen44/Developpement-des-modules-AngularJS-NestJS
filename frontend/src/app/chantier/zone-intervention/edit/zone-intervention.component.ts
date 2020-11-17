import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    ZoneIntervention,
    Franchise,
    EnumStatutStrategie,
} from '@aleaac/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { ZoneInterventionService } from '../../../resource/zone-intervention/zone-intervention.service';
import { Chantier } from '@aleaac/shared';
import { ChantierService } from '../../chantier.service';
import { Strategie } from '../../../resource/strategie/Strategie';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { MateriauZoneService } from '../../../resource/materiau-construction-amiante/materiau-zone.service';
import { UserStore } from '../../../resource/user/user.store';


@Component({
    selector: 'app-zone-intervention',
    templateUrl: './zone-intervention.component.html',
    styleUrls: ['./zone-intervention.component.scss']
})
export class ZoneInterventionComponent implements OnInit, OnDestroy {
    onglet: string = 'definition';

    idStrategie: number;
    idChantier: number;
    idZoneIntervention: number;
    zoneIntervention: ZoneIntervention | null = new ZoneIntervention();
    franchise: Franchise | null; // Pour les listes enrichissables
    isPatchValueDone: boolean = false; // Pour les listes enrichissable, il faut savoir si c'est chargé

    openModalMateriauZone: boolean = false;
    openModalProcessusZone: boolean = false;
    openModalHoraires: boolean = false;
    openModalPIC: boolean = false;


    chantier: Chantier;
    strategie: Strategie;

    informationsForm: FormGroup;
    errorsInformations: string[] = new Array<string>();
    submittedInformations: boolean = false;
    canEdit: boolean = true;
    isInit: boolean = true;

    canValidateStrategie: boolean = false;
    isStrategieValidee: boolean = false;
    isValidationEnCours: boolean = false;

    champsInformations: Map<string, string> = new Map<string, string>([
        ['reference', 'La référence'],
        ['libelle', 'Le libellé'],
        ['descriptif', 'Le descriptif'],
        ['statut', 'Le statut d\'occupation'],
        ['batiment', 'Le bâtiment'],
        ['isZoneDefinieAlea', 'La définition de la zone par AléaContrôles'],
        ['isSousAccreditation', 'Le fait que la zone soit sous accréditation'],
        ['commentaire', 'Le commentaire'],
        ['dureeTraitementEnSemaines', 'La durée de traitement'],
        ['confinement', 'Le type de confinement'],
        ['PIC', 'Le plan d\'installation chantier'],
        ['environnements', 'Choisir un environnement'],
    ]);

    subscriptionParams: any;
    subscriptionFranchise: any;

    constructor(
        private menuService: MenuService,
        private zoneInterventionService: ZoneInterventionService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private chantierService: ChantierService,
        private franchiseService: FranchiseService,
        private materiauZoneService: MateriauZoneService,
        private formBuilder: FormBuilder,
        private userStore: UserStore,
    ) {
        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            reference: [, Validators.required],
            libelle: ['', Validators.required],
            descriptif: ['', Validators.required],
            statut: ['', Validators.required],
            batiment: ['', Validators.required],
            isZoneDefinieAlea: [true, null],
            isSousAccreditation: [true, null],
            commentaire: ['', null],
            dureeTraitementEnSemaines: [null, null],
            confinement: [null, null],
            PIC: ['', null],
            nbGrpExtracteurs: [null, null],
            milieu: ['', null],
            environnements: ['', Validators.compose([Validators.required, Validators.pattern('.+')])],
        });
    }

    ngOnInit() {
        this.userStore.hasRight('STRAT_VALIDATE').then(val => {
            this.canValidateStrategie = val;
        });

        // Pour les listes enrichissables, il faut la franchise
        if (!this.subscriptionFranchise) {
            this.subscriptionFranchise = this.franchiseService.franchise.subscribe((franchise) => {
                this.franchise = null;

                setTimeout(() => { this.franchise = franchise; }, 10);
                if (!this.subscriptionParams) {
                    this.subscriptionParams = this.route.params.subscribe(params => {
                        if (params.id) {
                            this.idChantier = Number.parseInt(params.id);

                            if (!this.chantier || this.chantier.id !== this.idChantier) {
                                this.chantierService.get(this.idChantier).subscribe(ch => {
                                    this.chantier = ch;

                                    this.isValidationEnCours = this.chantier.strategies.findIndex(s => s.statut === EnumStatutStrategie.STRAT_A_VALIDER) > -1;
                                    this.isStrategieValidee = this.chantier.strategies.findIndex(s => s.statut === EnumStatutStrategie.STRAT_VALIDEE) > -1;

                                    this.canEdit = this.chantier.strategies.findIndex(s => s.statut === EnumStatutStrategie.STRAT_VALIDEE) === -1;

                                    if (params.idStrategie) {
                                        this.idStrategie = Number.parseInt(params.idStrategie);
                                        this.strategie = this.chantier.strategies.find(s => s.id === Number.parseInt(params.idStrategie))!;
                                    }
                                });
                            }


                            if (params.idZone) {
                                this.idZoneIntervention = Number.parseInt(params.idZone);
                                if (!this.zoneIntervention || this.zoneIntervention.id !== this.idZoneIntervention) {
                                    this.zoneInterventionService.getZoneInterventionById(this.idZoneIntervention).subscribe(zi => {
                                        this.zoneIntervention = zi;

                                        this.reloadZone(this.isInit);
                                    });
                                }
                            }

                            this.menuService.setMenu([
                                ['Chantiers', '/chantier/liste'],
                                ['Chantier', '/chantier/' + params.id + '/informations'],
                                ['Stratégie', '/chantier/' + params.id + '/strategie/' + params.idStrategie],
                                ['Zone', ''],
                            ]);

                            if (params.onglet) {
                                this.onglet = params.onglet;
                            }
                        }
                    });
                }
            });
        }
    }


    reloadZone(isInit: boolean = false) {
        if (isInit) {
            this.materiauZoneService.getAllMateriauZone(this.zoneIntervention!.id).subscribe(mz => {
                this.zoneIntervention!.materiauxZone = mz;
                this.isInit = false;
            });
        } else {
            if (this.idZoneIntervention) {
                this.zoneInterventionService.getZoneInterventionById(this.idZoneIntervention).subscribe((zone) => {
                    this.zoneIntervention = null;

                    setTimeout(() => {
                        this.zoneIntervention = zone;
                        this.materiauZoneService.getAllMateriauZone(zone.id).subscribe(mz => {
                            this.zoneIntervention!.materiauxZone = mz;
                        });
                    }, 10);
                });
            }
        }
    }

    changeOnglet(onglet) {
        this.reloadZone();
        this.router.navigate(['chantier', this.idChantier, 'strategie', this.idStrategie, 'edit-zone', this.idZoneIntervention, onglet]);
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }

    compareEnum(a, b) {
        return a && b ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf()) : false;
    }

    compare(a, b) {
        return a && b ? a.id === b.id : false;
    }

    unlockPrlvmntModifiers() {
        if (confirm('Êtes-vous sûr de vouloir dévérouiller ce champ ? Cela va nécessiter un nouveau calcul des prélèvements.')) {
            alert('C\'est pas encore codé, sorry');
        }
    }

    ngOnDestroy() {
        this.subscriptionFranchise.unsubscribe();
        this.subscriptionParams.unsubscribe();
    }

    askValidation() {
        if (confirm('Voulez-vous demander la validation de cette stratégie ? Une notification et un e-mail seront envoyés au valideur.')) {
            this.chantierService.askValidation(this.chantier).subscribe(() => {
                this.notificationService.setNotification('success', ['Une notification a été envoyée au valideur.']);
                this.isValidationEnCours = true;
            });
        }
    }

    validate() {
        if (confirm('Voulez-vous valider cette stratégie ?')) {
            this.chantierService.validate(this.chantier).subscribe(() => {
                this.notificationService.setNotification('success', ['Stratégie validée.']);
                this.canEdit = false;

                this.isStrategieValidee = true;
                this.chantier.versionStrategie++;

                this.menuService.setMenu([
                    ['Chantiers', '/chantier'],
                    ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.idChantier + '/informations'],
                    ['Stratégies (V ' + this.chantier.versionStrategie + ')', '']
                ]);

                this.reloadZone();
            });
        }
    }

    unlock() {
        if (confirm('Voulez-vous modifier cette stratégie ? Cela créera une nouvelle version.')) {
            this.chantierService.unlock(this.chantier).subscribe(() => {
                this.notificationService.setNotification('success', ['Stratégie dévérouillée.']);
                this.canEdit = true;
                this.isValidationEnCours = false;
                this.isStrategieValidee = false;

                this.reloadZone();
            });
        }
    }
}
