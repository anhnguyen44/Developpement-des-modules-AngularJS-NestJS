import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { GES, ProcessusZone, Franchise, Chantier, ITacheProcessus } from '@aleaac/shared';
import { Filtre } from '../../../logistique/Filtre';
import { FormGroup, FormBuilder, FormArray, FormControl, Form } from '@angular/forms';
import { ValidationService } from '../../../resource/validation/validation.service';
import { NotificationService } from '../../../notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FiltreService } from '../../../logistique/filtre.service';
import { ChantierService } from '../../chantier.service';
import { format } from 'url';
import { Pompe } from '../../../logistique/Pompe';
import { ProcessusZoneService } from '../../../resource/processus-zone/processus-zone.service';
import { TacheProcessus } from '../../../processus/TacheProcessus';
import { TacheProcessusService } from '../../../processus/tache-processus.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { GESService } from '../../../resource/processus-zone/ges.service';
import { ProcessusService } from '../../../processus/processus.service';
import { EnumPhaseOperationnelle } from '@aleaac/shared/src/models/ges.model';


@Component({
    selector: 'app-ges-processus-zone',
    templateUrl: './ges.component.html',
    styleUrls: ['./ges.component.scss']
})
export class GesProcessusZoneComponent implements OnInit {
    @Input() processusZone: ProcessusZone;
    @Input() redirectPath: (string | number)[];
    @Input() canEdit: boolean = true;

    @Output() emitListeGES: EventEmitter<GES[]> = new EventEmitter<GES[]>();

    franchise: Franchise;
    chantier: Chantier;

    submitted: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([]);

    listeTachesInstallation: TacheProcessus[] = new Array<TacheProcessus>();
    listeTachesRetrait: TacheProcessus[] = new Array<TacheProcessus>();
    listeTachesRepli: TacheProcessus[] = new Array<TacheProcessus>();
    listeTachesTotale: TacheProcessus[] = new Array<TacheProcessus>();

    selectedTache: TacheProcessus[] = new Array<TacheProcessus>();

    enumPhaseOperationnelle: typeof EnumPhaseOperationnelle = EnumPhaseOperationnelle;


    processusZoneForm = this.formBuilder.group({
        id: [''],
        idBureau: [''],
        libelle: [''],
        rang: [''],
        commentaire: [''],
        idStatut: [''],
        idDevisCommande: [''],
        dateValidation: [''],
        idFranchise: [''],
        idStrategie: [''],
        idOrdreProcessusZone: [null],
        listeGES: this.formBuilder.array([])
    });

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private processusZoneService: ProcessusZoneService,
        private processusService: ProcessusService,
        private tacheProcessusService: TacheProcessusService,
        private router: Router,
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private franchiseService: FranchiseService,
        private gesService: GESService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.chantierService.get(params.id).subscribe((chantier) => {
                this.chantier = chantier;
            });
        });

        this.processusZoneForm.patchValue(this.processusZone);

        if (!this.canEdit) {
            this.processusZoneForm.disable();
        }

        if (this.processusZone.idProcessus) {
            this.processusService.get(this.processusZone.idProcessus).subscribe(pro => {

                this.listeTachesInstallation = new Array<TacheProcessus>();
                this.listeTachesRetrait = new Array<TacheProcessus>();
                this.listeTachesRepli = new Array<TacheProcessus>();
                if (pro.tachesInstallation && pro.tachesInstallation.length) {
                    pro.tachesInstallation.forEach(ptp => {
                        this.listeTachesInstallation.push(ptp);
                        this.listeTachesTotale.push(ptp);
                    });
                }

                if (pro.tachesRetrait && pro.tachesRetrait.length) {
                    pro.tachesRetrait.forEach(pts => {
                        this.listeTachesRetrait.push(pts);
                        this.listeTachesTotale.push(pts);
                    });
                }

                if (pro.tachesRepli && pro.tachesRepli.length) {
                    pro.tachesRepli.forEach(ptr => {
                        this.listeTachesRepli.push(ptr);
                        this.listeTachesTotale.push(ptr);
                    });
                }

                this.processusZone.processus = pro;

                if (!this.canEdit) {
                    this.processusZoneForm.disable();
                }
            });
        }

        // Pour les listes enrichissables, il faut la franchise
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;

            // C'est fait dans le subscribe de la franchise car les TacheProcessus ont besoin de l'id franchise
            if (!this.processusZone.listeGES || this.processusZone.listeGES.length === 0) {
                this.processusZone.listeGES = new Array<GES>();
                const tmpGES = new GES();
                tmpGES.idZoneIntervention = this.processusZone.idZoneIntervention;
                tmpGES.nom = 'GES ' + (this.processusZone.listeGES.length + 1);
                tmpGES.nbFiltres = 4;
                tmpGES.nbOperateursTerrain = 2;
                tmpGES.nbPompes = 4;
                tmpGES.taches = new Array<TacheProcessus>();
                tmpGES.phaseOperationnelle = EnumPhaseOperationnelle.Installation;

                this.addGES(tmpGES);
            } else {
                for (const ges of this.processusZone.listeGES) {
                    this.addGES(ges);
                }
            }
        });

        this.processusZoneForm.valueChanges.subscribe(() => {
            this.listChanged();
        });
    }

    // PRELEVEMENT

    async createGES(ges?: GES): Promise<FormGroup> {
        const formGroup = this.formBuilder.group({
            id: [''],
            nom: [''],
            description: [''],
            zoneIntervention: [this.processusZone.idZoneIntervention],
            nbPompes: [4],
            nbFiltres: [4],
            nbOperateursTerrain: [2],
            phaseOperationnelle: [EnumPhaseOperationnelle.Installation],
            taches: this.formBuilder.array([])
        });

        if (!ges) {
            ges = new GES();
            ges.idZoneIntervention = this.processusZone.idZoneIntervention;
            ges.nom = 'GES ' + (this.processusZone.listeGES.length + 1);
            ges.nbFiltres = 4;
            ges.nbOperateursTerrain = 2;
            ges.nbPompes = 4;
            ges.phaseOperationnelle = EnumPhaseOperationnelle.Installation;
            ges.taches = new Array<TacheProcessus>();
            ges = await this.gesService.createGES(ges).toPromise();

            formGroup.patchValue(ges);
            if (!ges.taches || ges.taches.length === 0) {
                // Rien
            } else {
                for (const tacheProcessus of ges.taches) {
                    this.addTacheProcessus(formGroup, tacheProcessus);
                }
            }
            return formGroup;
        } else {
            if (!ges.id) {
                ges = await this.gesService.createGES(ges).toPromise();
            }

            // C'est pour pouvoir afficher le formulaire comme il faut car typeORM renvoie un string et TypeScript  croit que c'est une enum
            // if (ges.phaseOperationnelle.toString() === 'Installation') {
            //     ges.phaseOperationnelle = EnumPhaseOperationnelle.Installation;
            // } else if (ges.phaseOperationnelle.toString() === 'Retrait') {
            //     ges.phaseOperationnelle = EnumPhaseOperationnelle.Retrait;
            // } else if (ges.phaseOperationnelle.toString() === 'Repli') {
            //     ges.phaseOperationnelle = EnumPhaseOperationnelle.Repli;
            // }

            formGroup.patchValue(ges);
            if (!ges.taches || ges.taches.length === 0) {
                // Rien
            } else {
                for (const tacheProcessus of ges.taches) {
                    this.addTacheProcessus(formGroup, tacheProcessus);
                }
            }
            return formGroup;
        }
    }

    async addGES(ges?: GES) {
        const listeGES = this.processusZoneForm.controls.listeGES as FormArray;
        listeGES.push(await this.createGES(ges));
    }

    removeGES(ges: GES): void {
        const listeGES = this.processusZoneForm.controls.listeGES as FormArray;
        listeGES.removeAt(listeGES.value.findIndex(findGES => findGES.id === ges.id));
    }

    // changePhase(nb: number, event: Event) {
    //     const currentGES = ((this.processusZoneForm.controls.listeGES as FormArray).controls[nb]! as FormGroup).controls;
    //     const updateItem = this.processusZone.listeGES.find(g => g.id === currentGES.id.value)!;
    //     const index = this.processusZone.listeGES.indexOf(updateItem);

    //     // Si on change de phase opérationnelle, la liste des taches dispo changen on pete les taches atachées
    //     if ((this.processusZoneForm.controls.listeGES as FormArray).controls[nb].get('taches')
    //         && ((this.processusZoneForm.controls.listeGES as FormArray).controls[nb]!.get('taches')! as FormArray).length) {

    //         if (confirm('Êtes-vous sûr de vouloir changer de phase opérationnelle ? Les tâches associées à la GES seront perdues.')) {
    //             this.processusZone.listeGES[index].taches = [];
    //             currentGES.taches = this.formBuilder.array([]);
    //         } else {
    //             window.event!.preventDefault();
    //             window.event!.stopPropagation();
    //             this.gesService.getGESById(updateItem.id).subscribe(data => {
    //                 // On remet la phase d'avant

    //                 if (data.phaseOperationnelle.toString() === 'Installation') {
    //                     data.phaseOperationnelle = EnumPhaseOperationnelle.Installation;
    //                 } else if (data.phaseOperationnelle.toString() === 'Retrait') {
    //                     data.phaseOperationnelle = EnumPhaseOperationnelle.Retrait;
    //                 } else if (data.phaseOperationnelle.toString() === 'Repli') {
    //                     data.phaseOperationnelle = EnumPhaseOperationnelle.Repli;
    //                 }

    //                 ((this.processusZoneForm.controls.listeGES as FormArray).controls[nb]! as FormGroup)
    //                     .patchValue({ phaseOperationnelle: data.phaseOperationnelle });
    //             });
    //         }
    //     } else {

    //     }
    // }

    createTacheProcessus(ges: FormGroup, tacheProcessus?: TacheProcessus): FormGroup {
        const formGroup = this.formBuilder.group({
            id: [''],
            nom: [''],
            idFranchise: [''],
        });

        if (tacheProcessus) {
            formGroup.patchValue(tacheProcessus);
            formGroup.get('idFranchise')!.setValue(this.franchise.id);
        } else {
            const tache = new TacheProcessus();
            console.log(ges);
            tache.idFranchise = this.franchise.id;
            this.tacheProcessusService.add(tache).subscribe((newTacheProcessus) => {
                formGroup.patchValue(newTacheProcessus);
            });
        }

        return formGroup;
    }

    addTacheProcessus(ges: FormGroup, tacheProcessus?: TacheProcessus): void {
        const taches = ges.controls.taches as FormArray;
        taches.push(this.createTacheProcessus(ges, tacheProcessus));
    }

    removeTacheProcessus(ges: FormGroup, tacheProcessus: TacheProcessus): void {
        const taches = ges.controls.taches as FormArray;
        taches.removeAt(taches.value.findIndex(findTacheProcessus => findTacheProcessus.id === tacheProcessus.id));
    }

    compare(val1, val2) {
        console.log(val1, val2);
        return val1 === val2;
    }

    // convenience getter for easy access to form fields
    get f() { return this.processusZoneForm.controls; }

    compareEnum(a: EnumPhaseOperationnelle, b: EnumPhaseOperationnelle) {
        return a !== undefined && b !== undefined
            ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf() || a.valueOf().toString() === b.valueOf().toString())
            : false;
    }

    listChanged() {
        const listeGES = new Array<GES>();

        for (const gesForm of (this.processusZoneForm.get('listeGES') as FormArray).controls) {
            const ges = new GES();

            ges.id = gesForm.get('id')!.value;
            ges.nom = gesForm.get('nom')!.value;
            ges.idZoneIntervention = this.processusZone.idZoneIntervention;
            ges.nbFiltres = gesForm.get('nbFiltres') ? gesForm.get('nbFiltres')!.value : 4;
            ges.nbOperateursTerrain = gesForm.get('nbOperateursTerrain') ? gesForm.get('nbOperateursTerrain')!.value : 2;
            ges.nbPompes = gesForm.get('nbPompes') ? gesForm.get('nbPompes')!.value : 4;
            ges.phaseOperationnelle = gesForm.get('phaseOperationnelle') ? gesForm.get('phaseOperationnelle')!.value : 1;
            ges.taches = new Array<TacheProcessus>();

            for (const tacheForm of (gesForm.get('taches') as FormArray).controls) {
                const tache = new TacheProcessus();

                tache.id = tacheForm.get('id') ? tacheForm.get('id')!.value : null;
                tache.idFranchise = tacheForm.get('idFranchise') ? tacheForm.get('idFranchise')!.value : null;
                tache.nom = tacheForm.get('nom') ? tacheForm.get('nom')!.value : '';

                ges.taches.push(tache);
            }

            listeGES.push(ges);
        }

        if (!this.canEdit) {
            this.processusZoneForm.disable();
        }

        this.emitListeGES.emit(listeGES);
    }
}
