import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
    ZoneIntervention, EnumTypeZoneIntervention, EnumStatutOccupationZone, Liste,
    Franchise, EnumConfinement, Environnement, EnumTypeLocal, EnumTypeStrategie, EnumDensiteOccupationTheorique, EnumTypeActivite, EnumExpositionAir, EnumExpositionChocs
} from '@aleaac/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { ZoneInterventionService } from '../../../resource/zone-intervention/zone-intervention.service';
import { Chantier } from '@aleaac/shared';
import { Strategie } from '../../../resource/strategie/Strategie';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Batiment } from '@aleaac/shared/src/models/batiment.model';
import { BatimentService } from '../../../resource/batiment/batiment.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { ListeService } from '../../../resource/liste/liste.service';
import { MateriauZone } from '@aleaac/shared';
import { HorairesOccupationLocaux } from '@aleaac/shared';
import { HorairesOccupationLocauxService } from '../../../resource/horaires-occupation/horaires-occupation.service';
import { ProcessusZone } from '@aleaac/shared/src/models/processus-zone.model';
import { TypeFichierService } from '../../../superadmin/typefichier/type-fichier.service';
import { FichierService } from '../../../resource/fichier/fichier.service';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { EnumTypeFichier } from '@aleaac/shared/src/models/typeFichier.model';
import { Fichier } from '../../../resource/fichier/Fichier';
import { EnvironnementService } from '../../../resource/environnement/environnement.service';
import { LocalUnitaire } from '@aleaac/shared';
import { LocalUnitaireService } from '../../../resource/local-unitaire/local-unitaire.service';
import { EnumMilieu } from '@aleaac/shared';
import { EnumEnvironnement } from '@aleaac/shared';
import { AccordionGroupComponent } from '../../../resource/accordion/accordion-group.component';
import { EnumSimulationObligatoire } from '@aleaac/shared/src/models/objectif.model';

@Component({
    selector: 'app-zone-definition',
    templateUrl: './zone-definition.component.html',
    styleUrls: ['./zone-definition.component.scss']
})
export class ZoneInterventionDefinitionComponent implements OnInit {

    idStrategie: number;
    idChantier: number;
    idZoneIntervention: number;
    @Input() zoneIntervention: ZoneIntervention | null;
    @Input() franchise: Franchise; // Pour les listes enrichissables
    @Input() chantier: Chantier;
    @Input() strategie: Strategie;
    @Input() canEdit: boolean = true;
    @Output() emitZoneNeedReload: EventEmitter<void> = new EventEmitter();
    isPatchValueDone: boolean = false; // Pour les listes enrichissable, il faut savoir si c'est chargé

    openModalMateriauZone: boolean = false;
    openModalProcessusZone: boolean = false;
    openModalHoraires: boolean = false;
    openModalPIC: boolean = false;

    typeFichierPIC: TypeFichier;

    displayMatZones: boolean = true; // Utilisé pour rafraîchir le composant liste matériaux quand on en ajoute 1
    materiauZoneToEdit: MateriauZone | null = null;
    displayProcZones: boolean = true; // Utilisé pour rafraîchir le composant liste processus quand on en ajoute 1
    processusZoneToEdit: ProcessusZone | null = null;

    displayAttentionVentilo: boolean = false;

    listeBatiments: Batiment[] = new Array<Batiment>();
    listeDescriptifZoneIntervention: Liste[] = new Array<Liste>();
    listePIC: Fichier[] = new Array<Fichier>();
    listeEnvironnements: Environnement[];
    environnementInterieur: Environnement;

    listeDensiteOccupationTheorique: Liste[];
    listeTypeActivite: Liste[];
    listeCommentaireOccupation: Liste[];
    listeExpositionAir: Liste[];
    listeExpositionChocs: Liste[];
    listeCommentaireExpositionAirChocs: Liste[];

    typeZone: EnumTypeZoneIntervention;
    enumTypeZone: typeof EnumTypeZoneIntervention = EnumTypeZoneIntervention;
    enumStatutOccupation: typeof EnumStatutOccupationZone = EnumStatutOccupationZone;
    enumConfinement: typeof EnumConfinement = EnumConfinement;
    enumMilieu: typeof EnumMilieu = EnumMilieu;
    enumDensiteOccupationTheorique: typeof EnumDensiteOccupationTheorique = EnumDensiteOccupationTheorique;
    enumTypeActivite: typeof EnumTypeActivite = EnumTypeActivite;
    enumExpositionAir: typeof EnumExpositionAir = EnumExpositionAir;
    enumExpositionChocs: typeof EnumExpositionChocs = EnumExpositionChocs;

    labelTypeZone: string = 'd\'Intervention';

    informationsForm: FormGroup;
    errorsInformations: string[] = new Array<string>();
    submittedInformations: boolean = false;

    modalStatutOccupation: boolean = false;

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

    currentOpenGroup: AccordionGroupComponent;
    localInf10: LocalUnitaire;
    localInf100inf15: LocalUnitaire[] = new Array<LocalUnitaire>();
    refLocalMiniToAdd: string;
    localInf100sup15: LocalUnitaire[] = new Array<LocalUnitaire>();
    longueurLocalToAdd: number = 16;
    refLongLocalToAdd: string;
    localSup100: LocalUnitaire[] = new Array<LocalUnitaire>();
    surfaceLocalToAdd: number = 101;
    refSup100ToAdd: string;
    localGrp: LocalUnitaire[] = new Array<LocalUnitaire>();
    nomGroupToAdd: string;
    nomLocalGroupToAdd: string[] = new Array<string>();
    surfaceLocalGroupToAdd: number[] = new Array<number>();
    localCage: LocalUnitaire[] = new Array<LocalUnitaire>();
    largeurCage: number = 0;
    longueurCage: number = 0;
    surfaceCageToAdd: number = 0;
    niveauxCageToAdd: number = 2;
    refCageToAdd: string;


    inf100inf15isDisabled: boolean = true;
    inf10isDisabled: boolean = true;

    constructor(
        private menuService: MenuService,
        private zoneInterventionService: ZoneInterventionService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private batimentService: BatimentService,
        private validationService: ValidationService,
        private listeService: ListeService,
        private horairesOccupationService: HorairesOccupationLocauxService,
        private typeFichierService: TypeFichierService,
        private fichierService: FichierService,
        private environnementService: EnvironnementService,
        private localUnitaireService: LocalUnitaireService,
    ) {
        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            reference: ['', Validators.required],
            libelle: ['', Validators.required],
            descriptif: ['', null],
            statut: ['', Validators.required],
            batiment: ['', Validators.required],
            isZoneDefinieAlea: [true, null],
            isSousAccreditation: [true, null],
            commentaire: ['', null],
            dureeTraitementEnSemaines: [null, null],
            confinement: [null, null],
            PIC: ['', null],
            nbGrpExtracteurs: [null, null],
            milieu: [EnumEnvironnement.MILIEU_INTERIEUR, null],
            environnements: [EnumEnvironnement.MILIEU_INTERIEUR, null],
            conditions: ['', null],
            densiteOccupationTheorique: [null, null],
            typeActivite: [null, null],
            commentaireOccupation: [null, null],
            expositionAir: [null, null],
            expositionChocs: [null, null],
            commentaireExpositionAirChocs: [null, null],
            repartitionPrelevements: [null, null],
            autreActivite: [null, null],
        });
    }

    ngOnInit() {
        // Si on a déjà passé en entrée les zones, on cherche rien et on compte juste
        // if (this.idZoneIntervention || this.idStrategie) {
        //     this.loadZone({ idZone: this.idZoneIntervention, idStrategie: this.idStrategie });
        //     return;
        // }

        this.idStrategie = this.strategie.id;
        this.idZoneIntervention = this.zoneIntervention!.id;
        this.idChantier = this.chantier.id;

        if (!this.canEdit) {
            this.informationsForm.disable();
        }


        this.typeFichierService.get(EnumTypeFichier.CHANTIER_PIC).subscribe(tf => {
            this.typeFichierPIC = tf;

            this.fichierService.getAll('chantier', this.idChantier).subscribe(fichiers => {
                this.listePIC = fichiers.filter(f => f.idTypeFichier === tf.id);
            }, err => {
                console.error(err);
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }, err => {
            console.error(err);
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });

        this.environnementService.getAllEnvironnement().subscribe(envs => {
            this.listeEnvironnements = envs;
            this.environnementInterieur = envs.find(e => e.id === EnumEnvironnement.MILIEU_INTERIEUR)!;
        }, err => {
            console.error(err);
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });

        this.batimentService.getByChantier(this.idChantier).subscribe(batims => {
            this.listeBatiments = [];
            for (const batim of batims) {
                this.listeBatiments.push(batim);
            }
        }, err => {
            console.error(err);
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });

        if (this.strategie) {
            if (this.strategie.typeStrategie === EnumTypeStrategie.SPATIALE) {
                this.labelTypeZone = 'Homogène';
                this.typeZone = EnumTypeZoneIntervention.ZH;
            } else if (this.strategie.typeStrategie === EnumTypeStrategie.SUIVI) {
                this.labelTypeZone = 'de Travail';
                this.typeZone = EnumTypeZoneIntervention.ZT;
            }
        }

        this.route.params.subscribe(params => {
            if (this.zoneIntervention && !this.zoneIntervention.id && params.idZone) {
                this.zoneInterventionService.getZoneInterventionById(params.idZone).subscribe(zone => {
                    this.zoneIntervention = zone;
                    this.loadZone({ idZone: this.zoneIntervention!.id, idStrategie: this.strategie.id });
                });
            } else {
                if (params.idZone) {
                    this.loadZone({ idZone: params.idZone, idStrategie: this.strategie.id });
                } else {
                    this.loadZone({ idZone: this.zoneIntervention!.id, idStrategie: this.strategie.id });
                }
            }
        });

        for (const ech of this.zoneIntervention!.echantillonnages) {
            if (ech.isRealise) {
                if (ech.objectif.simulationObligatoire === EnumSimulationObligatoire.JAMAIS) {
                    continue;
                }
                if (ech.objectif.simulationObligatoire === EnumSimulationObligatoire.TOUJOURS) {
                    this.displayAttentionVentilo = true;
                    break;
                }
                if (ech.objectif.simulationObligatoire === EnumSimulationObligatoire.POSSIBLE) {
                    switch(ech.objectif.code) {
                        case 'G':
                        case 'M':
                        case 'B':
                        case 'C':
                        case 'E':
                        case 'F':
                            // Cas LV OQP vs le reste
                            if (this.zoneIntervention!.statut !== EnumStatutOccupationZone.LOCAL_DE_VIE_OCCUPE) {
                                this.displayAttentionVentilo = true;
                            }
                            break;
                        case 'U':
                            // Cas nb Extracteurs
                            if (this.zoneIntervention!.nbGrpExtracteurs === 0) {
                                this.displayAttentionVentilo = true;
                            }
                            break;
                        case 'W':
                        case 'X':
                            // Cas "circu air insuffisante"
                            if (this.zoneIntervention!.conditions.indexOf('insuffisant') > -1) {
                                this.displayAttentionVentilo = true;
                            }
                            break;
                        case 'A':
                        case 'D':
                            // Cas LV vs LOV
                            if (
                                this.zoneIntervention!.statut === EnumStatutOccupationZone.LOCAL_OCCASIONNELLEMENT_VISITE_OCCUPE
                                || this.zoneIntervention!.statut === EnumStatutOccupationZone.LOCAL_OCCASIONNELLEMENT_VISITE_VIDE
                                ) {
                                this.displayAttentionVentilo = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if (this.displayAttentionVentilo === true) {
                break;
            }
        }
    }

    private loadZone(params) {
        if (params.idZone || this.zoneIntervention!.id) {
            this.idZoneIntervention = Number.parseInt(params.idZone);

            console.log(this.zoneIntervention);
            // this.zoneIntervention!.statut = EnumStatutOccupationZone[this.zoneIntervention!.statut.toString()];
            this.informationsForm.patchValue(this.zoneIntervention!);
            this.isPatchValueDone = true;
            if (this.zoneIntervention!.type === EnumTypeZoneIntervention.ZH
                || this.zoneIntervention!.type.valueOf() === EnumTypeZoneIntervention.ZH.valueOf()
                || this.zoneIntervention!.type.toString() === EnumTypeZoneIntervention.ZH.toString()
                || this.zoneIntervention!.type.toString() === 'ZH') {
                if (this.zoneIntervention!.locaux && this.zoneIntervention!.locaux.length) {
                    // <= 100m² && <= 15m de long
                    const locInf100inf15 =
                        [...this.zoneIntervention!.locaux].filter(l => l.type === EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M
                            || l.type.toString() === 'S_INF_EGAL_100M2_L_INF_EGAL_15M');
                    if (locInf100inf15) {
                        this.localInf100inf15 = locInf100inf15;
                    }

                    // <= 100m² && > 15m de long
                    const locInf100sup15 =
                        [...this.zoneIntervention!.locaux].filter(l => l.type === EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M
                            || l.type.toString() === 'S_INF_EGAL_100M2_L_SUP_15M');
                    if (locInf100sup15 && locInf100sup15.length) {
                        this.localInf100sup15 = locInf100sup15;
                    }
                    // > 100m²
                    const locSup100 = [...this.zoneIntervention!.locaux].filter(l => l.type === EnumTypeLocal.S_SUP_100M2
                        || l.type.toString() === 'S_SUP_100M2');
                    if (locSup100 && locSup100.length) {
                        this.localSup100 = locSup100;
                    }
                    // Groupements
                    const locGrp = [...this.zoneIntervention!.locaux].filter(l => l.type === EnumTypeLocal.GROUPEMENT
                        || l.type.toString() === 'GROUPEMENT');
                    if (locGrp && locGrp.length) {
                        this.localGrp = locGrp;
                    }
                    // Cages d'escalier
                    const locCage = [...this.zoneIntervention!.locaux].filter(l => l.type === EnumTypeLocal.CAGE_ESCALIER
                        || l.type.toString() === 'CAGE_ESCALIER');
                    if (locCage && locCage.length) {
                        this.localCage = locCage;
                    }
                } else {
                    // Init des locaux Unitaires
                    this.zoneIntervention!.locaux = new Array<LocalUnitaire>();
                }
            }
        } else {
            this.zoneIntervention = new ZoneIntervention();

            let nbZH = 0;
            let nbZT = 0;
            for (const strat of this.chantier.strategies) {
                if (strat.typeStrategie === EnumTypeStrategie.SPATIALE) {
                    nbZH += strat.zonesIntervention.length;
                } else if (this.strategie.typeStrategie === EnumTypeStrategie.SUIVI) {
                    nbZT += strat.zonesIntervention.length;
                }
            }

            this.zoneInterventionService.getByStrategie(params.idStrategie).subscribe(data => {
                this.idStrategie = params.idStrategie;
                if (this.strategie.typeStrategie === EnumTypeStrategie.SPATIALE) {
                    this.zoneIntervention!.reference = 'ZH-';
                    this.zoneIntervention!.type = EnumTypeZoneIntervention.ZH;
                    this.zoneIntervention!.reference += this.pad(nbZH + 1, 2);
                } else if (this.strategie.typeStrategie === EnumTypeStrategie.SUIVI) {
                    this.zoneIntervention!.reference = 'ZT-';
                    this.zoneIntervention!.type = EnumTypeZoneIntervention.ZT;
                    this.zoneIntervention!.reference += this.pad(nbZT + 1, 2);
                }

                this.informationsForm.patchValue(this.zoneIntervention!);
                this.isPatchValueDone = true;
            });
        }
    }

    pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    deepCopy(obj) {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' !== typeof obj) { return obj; }

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) { copy[attr] = this.deepCopy(obj[attr]); }
            }
            return copy;
        }

        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    }

    saveInf10(truc: boolean) {
        this.zoneIntervention!.isZoneInf10 = truc;
        const tmpZone = <ZoneIntervention>this.deepCopy(this.zoneIntervention);
        if (tmpZone && tmpZone.materiauxZone) {
            delete tmpZone.materiauxZone;
        }

        if (tmpZone.isZoneInf10) {
            tmpZone.nbPiecesUnitaires = 1;
        }
        const toto = tmpZone as any;
        delete toto.zoneInterventionId;
        delete toto.PIC;
        delete toto.batiment;
        this.zoneInterventionService.updateZoneIntervention(toto).subscribe(data => {
            this.zoneInterventionService.getZoneInterventionById(tmpZone.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    private reloadZone(zi: ZoneIntervention) {
        this.zoneIntervention = null;
        setTimeout(() => { this.zoneIntervention = zi; }, 10);
    }

    addLocalInf100Inf15() {
        const locInf100inf15 = new LocalUnitaire();
        locInf100inf15.idZILocal = this.idZoneIntervention;
        locInf100inf15.type = EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M;
        locInf100inf15.nom = this.refLocalMiniToAdd;

        this.localUnitaireService.createLocalUnitaire(locInf100inf15).subscribe(res => {
            this.zoneIntervention!.locaux.push(res);
            this.zoneIntervention!.locaux = JSON.parse(JSON.stringify(this.zoneIntervention!.locaux));
            this.localInf100inf15.push(res);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    delLocalInf100Inf15(local: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(local.id).subscribe(res => {
            this.zoneIntervention!.locaux = this.zoneIntervention!.locaux.filter(l => l.id !== local.id);
            this.localInf100inf15 = this.localInf100inf15.filter(l => l.id !== local.id);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }
    addLocalInf100Sup15() {
        const locInf100sup15 = new LocalUnitaire();
        locInf100sup15.idZILocal = this.idZoneIntervention;
        locInf100sup15.type = EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M;
        locInf100sup15.longueur = this.longueurLocalToAdd;
        locInf100sup15.nom = this.refLongLocalToAdd;

        this.localUnitaireService.createLocalUnitaire(locInf100sup15).subscribe(res => {
            this.zoneIntervention!.locaux.push(res);
            this.zoneIntervention!.locaux = JSON.parse(JSON.stringify(this.zoneIntervention!.locaux));
            this.localInf100sup15.push(res);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    delLocalInf100Sup15(local: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(local.id).subscribe(res => {
            this.zoneIntervention!.locaux = this.zoneIntervention!.locaux.filter(l => l.id !== local.id);
            this.localInf100sup15 = this.localInf100sup15.filter(l => l.id !== local.id);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    addLocalSup100() {
        const locSup100 = new LocalUnitaire();
        locSup100.idZILocal = this.idZoneIntervention;
        locSup100.type = EnumTypeLocal.S_SUP_100M2;
        locSup100.surface = this.surfaceLocalToAdd;
        locSup100.nom = this.refSup100ToAdd;

        this.localUnitaireService.createLocalUnitaire(locSup100).subscribe(res => {
            this.zoneIntervention!.locaux.push(res);
            this.zoneIntervention!.locaux = JSON.parse(JSON.stringify(this.zoneIntervention!.locaux));
            this.localSup100.push(res);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    delLocalSup100(local: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(local.id).subscribe(res => {
            this.zoneIntervention!.locaux = this.zoneIntervention!.locaux.filter(l => l.id !== local.id);
            this.localSup100 = this.localSup100.filter(l => l.id !== local.id);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    addGrp() {
        if (this.nomGroupToAdd && this.nomGroupToAdd.length > 0) {
            const locGrp = new LocalUnitaire();
            locGrp.idZILocal = this.idZoneIntervention;
            locGrp.type = EnumTypeLocal.GROUPEMENT;
            locGrp.nom = this.nomGroupToAdd;

            this.localUnitaireService.createLocalUnitaire(locGrp).subscribe(res => {
                this.zoneIntervention!.locaux.push(res);
                this.localGrp.push(res);
                this.nomGroupToAdd = '';
                this.nomLocalGroupToAdd.push('');
                this.surfaceLocalGroupToAdd.push(0);
                this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                    this.reloadZone(zi);
                });
            });
        } else {
            this.notificationService.setNotification('danger', ['Veuillez renseigner un nom de groupement.']);
        }
    }

    deleteGrp(grp: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(grp.id).subscribe(res => {
            this.nomLocalGroupToAdd.pop();
            this.surfaceLocalGroupToAdd.pop();
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    addLocalGrp(idParent: number, index: number) {
        if (this.nomLocalGroupToAdd[index] && this.nomLocalGroupToAdd[index].length > 0
            && this.surfaceLocalGroupToAdd[index] && this.surfaceLocalGroupToAdd[index] > 0) {
            const locGrp = new LocalUnitaire();
            locGrp.idZILocal = this.idZoneIntervention;
            locGrp.type = EnumTypeLocal.GROUPEMENT;
            locGrp.nom = this.nomLocalGroupToAdd[index];
            locGrp.surface = this.surfaceLocalGroupToAdd[index];
            locGrp.idParent = idParent;

            this.localUnitaireService.createLocalUnitaire(locGrp).subscribe(res => {
                this.zoneIntervention!.locaux.push(res);
                this.localGrp.push(res);
                this.nomLocalGroupToAdd[index] = '';
                this.surfaceLocalGroupToAdd[index] = 0;
                this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                    this.reloadZone(zi);
                });
            });
        } else {
            this.notificationService.setNotification('danger', ['Veuillez renseigner un nom de local et une surface.']);
        }
    }

    deleteLocalGrp(grp: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(grp.id).subscribe(res => {
            this.zoneIntervention!.locaux = this.zoneIntervention!.locaux.filter(l => l.id !== grp.id);
            this.localGrp = this.localSup100.filter(l => l.id !== grp.id);
            this.ngOnInit();
        });
    }

    addCage() {
        const locCage = new LocalUnitaire();
        locCage.idZILocal = this.idZoneIntervention;
        locCage.type = EnumTypeLocal.CAGE_ESCALIER;
        locCage.largeur = this.largeurCage;
        locCage.longueur = this.longueurCage;
        locCage.surface = this.surfaceCageToAdd;
        locCage.nbNiveaux = this.niveauxCageToAdd;
        locCage.nom = this.refCageToAdd;

        this.localUnitaireService.createLocalUnitaire(locCage).subscribe(res => {
            this.zoneIntervention!.locaux.push(res);
            this.zoneIntervention!.locaux = JSON.parse(JSON.stringify(this.zoneIntervention!.locaux));
            this.localCage.push(res);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    delCage(local: LocalUnitaire) {
        this.localUnitaireService.removeLocalUnitaire(local.id).subscribe(res => {
            this.zoneIntervention!.locaux = this.zoneIntervention!.locaux.filter(l => l.id !== local.id);
            this.localCage = this.localCage.filter(l => l.id !== local.id);
            this.zoneInterventionService.getZoneInterventionById(this.zoneIntervention!.id).subscribe(zi => {
                this.reloadZone(zi);
            });
        });
    }

    updateSurfaceFromLL() {
        this.surfaceCageToAdd = this.longueurCage * this.largeurCage * this.niveauxCageToAdd;
    }

    deleteLLFromSurface() {
        this.largeurCage = 0;
        this.longueurCage = 0;
    }

    submitInformations() {
        this.submittedInformations = true;

        let doNotContinue = false;

        if (!this!.validateInformations()) {
            doNotContinue = true;
            this.validateAllFields(this.informationsForm);
        }

        if (doNotContinue === true) {
            this.notificationService.setNotification('danger', this.errorsInformations);
            return;
        }

        this.zoneIntervention = { ...this.zoneIntervention, ...this.informationsForm.value };
        if (this.zoneIntervention!.batiment) {
            this.zoneIntervention!.idBatiment = this.zoneIntervention!.batiment!.id;
            delete this.zoneIntervention!.batiment;
        }

        if (this.zoneIntervention!.PIC) {
            this.zoneIntervention!.idPIC = this.zoneIntervention!.PIC!.id;
            delete this.zoneIntervention!.PIC;
        } else if (this.zoneIntervention!.PIC === null) {
            delete this.zoneIntervention!.PIC;
            this.zoneIntervention!.idPIC = null;
        }

        if (this.idZoneIntervention) {
            const tutu = this.zoneIntervention as any;
            delete tutu.zoneInterventionId;
            this.zoneInterventionService.updateZoneIntervention(tutu).subscribe(() => {
                this.notificationService.setNotification('success', ['Informations mises à jour']);
                // La listeDescriptifZoneIntervention est renvoyée dans le (emitListe) du composant quand il est chargé, ça évite 2 appels
                this.listeService.createIfNeeded(this.zoneIntervention!.descriptif, this.listeDescriptifZoneIntervention, this.franchise.id)
                    .subscribe(() => {
                        console.log('Item créé');
                        if (this.isPatchValueDone) {
                            this.emitZoneNeedReload.emit();
                        }
                    }, err => {
                        console.error(err);
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
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
            this.zoneIntervention = { ...this.zoneIntervention, ...this.informationsForm.value };
            this.zoneIntervention!.idStrategie = this.strategie.id;

            const titi = this.zoneIntervention as any;
            delete titi.zoneInterventionId;

            this.zoneInterventionService.createZoneIntervention(titi).subscribe((data) => {
                this.notificationService.setNotification('success', ['Zone créée.']);
                // const moduleToUse = this.superAdminId !== undefined ? 'superadmin' : 'parametrage';
                // this.routerService.navigate([moduleToUse + '/utilisateur/modifier', data.id]);
                this.idZoneIntervention = data.id;
                this.zoneIntervention!.id = data.id;
                // La listeDescriptifZoneIntervention est renvoyée dans le (emitListe) du composant quand il est chargé, ça évite 2 appels
                this.listeService.createIfNeeded(this.zoneIntervention!.descriptif, this.listeDescriptifZoneIntervention, this.franchise.id)
                    .subscribe(() => {
                        console.log('Item créé');
                        if (this.isPatchValueDone) {
                            this.emitZoneNeedReload.emit();
                        }
                    }, err => {
                        console.error(err);
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
                this.router.navigate(['chantier/', this.chantier.id, 'strategie', this.strategie.id, 'edit-zone', data.id, 'definition']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }

        // Save Item commentaire occupation locaux
        if (this.informationsForm.get('commentaireOccupation')!.value
            && this.informationsForm.get('commentaireOccupation')!.value.length > 0) {
            this.listeService.createIfNeeded(this.informationsForm.get('commentaireOccupation')!.value
                , this.listeCommentaireOccupation, this.franchise.id)
                .subscribe((data) => {
                    if (data) {
                        if (this.listeCommentaireOccupation.findIndex(l => l.valeur === data.valeur) === -1) {
                            this.listeCommentaireOccupation.push(data);
                        }
                    }

                    console.log('Item enregistré');
                    this.notificationService.setNotification('success', ['Item enregistré.']);
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
        }

        // Save Item commentaire ExpositionAirChocs
        if (this.informationsForm.get('commentaireExpositionAirChocs')!.value
            && this.informationsForm.get('commentaireExpositionAirChocs')!.value.length > 0) {
            this.listeService.createIfNeeded(this.informationsForm.get('commentaireExpositionAirChocs')!.value
                , this.listeCommentaireExpositionAirChocs, this.franchise.id)
                .subscribe((data) => {
                    if (data) {
                        if (this.listeCommentaireExpositionAirChocs.findIndex(l => l.valeur === data.valeur) === -1) {
                            this.listeCommentaireExpositionAirChocs.push(data);
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

    materiauZoneFromModal(materiau: MateriauZone) {
        // TODO : si on veut en faire qqch
        this.displayMatZones = false;
        setTimeout(() => {
            this.displayMatZones = true;
        }, 10);
    }

    processusZoneFromModal(processus: ProcessusZone) {
        // TODO : si on veut en faire qqch
        this.displayProcZones = false;
        setTimeout(() => {
            this.displayProcZones = true;
        }, 10);
    }

    getGrpList() {
        if (this.zoneIntervention!.locaux && this.zoneIntervention!.locaux.length) {
            return [...this.zoneIntervention!.locaux].filter(l => (l.idParent === 0 || l.idParent === null)
                && l.type === EnumTypeLocal.GROUPEMENT);
        } else {
            return [];
        }
    }

    setHoraires(horaires: HorairesOccupationLocaux[]) {
        this.zoneIntervention!.horaires = horaires;
        let i = 0;
        for (const horaire of this.zoneIntervention!.horaires) {
            if (horaire.id) {
                this.horairesOccupationService.updateHorairesOccupationLocaux(horaire).subscribe(() => {
                    i++;
                    if (i >= this.zoneIntervention!.horaires.length) {
                        this.notificationService.setNotification('success', ['Horaires d\'occupation des locaux mis à jour avec succès.']);
                        this.openModalHoraires = false;
                        this.submitInformations();
                    }
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
            } else {
                this.horairesOccupationService.createHorairesOccupationLocaux(horaire).subscribe(() => {
                    i++;
                    if (i >= this.zoneIntervention!.horaires.length) {
                        this.notificationService.setNotification('success', ['Horaires d\'occupation des locaux mis à jour avec succès.']);
                        this.openModalHoraires = false;
                        this.submitInformations();
                    }
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
            }
        }
    }

    openLaModalHoraires() {
        if (this.idZoneIntervention) {
            this.openModalHoraires = true;
        } else {
            alert('Veuillez sauvegarder la zone avant.');
        }
    }

    addMateriau() {
        this.materiauZoneToEdit = new MateriauZone();
        this.openModalMateriauZone = true;
    }

    editMateriau(materiau: MateriauZone) {
        this.materiauZoneToEdit = materiau;
        this.openModalMateriauZone = true;
    }

    addProcessus() {
        this.processusZoneToEdit = new ProcessusZone();
        this.openModalProcessusZone = true;
    }

    editProcessus(processus: ProcessusZone) {
        this.processusZoneToEdit = processus;
        this.openModalProcessusZone = true;
    }

    setNewPIC(fichier: Fichier) {
        console.log(fichier);
        if (fichier) {
            this.listePIC.push(fichier);
            this.informationsForm.get('PIC')!.setValue(fichier);
            this.zoneIntervention!.PIC = fichier;
            this.zoneIntervention!.idPIC = fichier.id;
            this.openModalPIC = false;
            this.submitInformations();
        }
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
