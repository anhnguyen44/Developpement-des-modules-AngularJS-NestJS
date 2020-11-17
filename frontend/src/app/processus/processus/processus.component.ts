import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProcessusService } from '../processus.service';
import { Processus } from '../Processus';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MpcaService } from '../mpca.service';
import { TypeBatimentService } from '../../resource/type-batiment/type-batiment.service';
import { Mpca } from '../Mpca';
import { TypeBatiment } from '../TypeBatiment';
import { OutilTechniqueService } from '../outil-technique.service';
import { OutilTechnique } from '../OutilTechnique';
import { TravailHumideService } from '../travail-humide.service';
import { TravailHumide } from '../TravailHumide';
import { CaptageAspirationSourceService } from '../captage-aspiration-source.service';
import { CaptageAspirationSource } from '../CaptageAspirationSource';
import { MenuService } from '../../menu/menu.service';
import { Contact } from '../../contact/Contact';
import { EnumAppareilsProtectionRespiratoire, EnumEmpoussierementGeneral } from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';
import { ValidationService } from '../../resource/validation/validation.service';
import { Router } from '@angular/router';
import { TacheProcessusService } from '../tache-processus.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Franchise } from '../../resource/franchise/franchise';
import { TacheProcessus } from '../TacheProcessus';
import { Pompe } from '../../logistique/Pompe';
import { Prelevement } from '../Prelevement';

@Component({
    selector: 'app-processus',
    templateUrl: './processus.component.html',
    styleUrls: ['./processus.component.scss']
})
export class ProcessusComponent implements OnInit {
    @Input() idProcessus: number;
    @Input() isNew: boolean;
    @Input() idCompte: number;
    @Input() isModal: boolean = false;

    @Output() emitProcessus: EventEmitter<Processus> = new EventEmitter<Processus>();

    enumEmpoussierementGeneral = EnumEmpoussierementGeneral;
    keys: any;
    enumAppareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire;
    keysAppareil: any;
    submited: boolean = false;
    listMpca: Mpca[];
    listTypeBatiment: TypeBatiment[];
    listOutilTechnique: OutilTechnique[];
    listTravailHumide: TravailHumide[];
    listCaptageAspirationSource: CaptageAspirationSource[];
    processus: Processus;
    franchise: Franchise;
    tachesProcessus: TacheProcessus[];
    selectedTacheInstallation: string;
    selectedTacheRetrait: string;
    selectedTacheRepli: string;
    processusForm = this.formBuilder.group({
        id: [null],
        idCompte: ['', [Validators.required]],
        description: [''],
        idCaptageAspirationSource: ['', [Validators.required]],
        idMpca: ['', [Validators.required]],
        idOutilTechnique: ['', [Validators.required]],
        idTravailHumide: ['', [Validators.required]],
        idTypeBatiment: ['', [Validators.required]],
        isProcessusCyclique: [''],
        libelle: ['', [Validators.required]],
        niveauAttenduFibresAmiante: [''],
        tachesInstallation: this.formBuilder.array([]),
        tachesRetrait: this.formBuilder.array([]),
        tachesRepli: this.formBuilder.array([]),
        tmin: [222],
        tsatA: ['']
    });

    champsInformations: Map<string, string> = new Map<string, string>([
        ['libelle', 'Le libellé'],
        ['idCaptageAspirationSource', 'Le champ Captage / Aspiration à la source'],
        ['idTravailHumide', 'Le champ travail à l\'humide'],
        ['idEmpoussierementGeneralAttendu', 'Le champ Empoussiérement général attendu'],
        ['idMpca', 'Le champ MPCA'],
        ['idOutilTechnique', 'Le champ technique de retrait'],
    ]);

    constructor(
        private processusService: ProcessusService,
        private formBuilder: FormBuilder,
        private mpcaService: MpcaService,
        private typeBatimentService: TypeBatimentService,
        private outilTechniqueService: OutilTechniqueService,
        private travailHumideService: TravailHumideService,
        private captageAspirationSourceService: CaptageAspirationSourceService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private router: Router,
        private tacheProcessusService: TacheProcessusService,
        private franchiseService: FranchiseService
    ) { }

    ngOnInit() {
        this.keys = Object.keys(this.enumEmpoussierementGeneral).filter(Number);
        this.keysAppareil = Object.keys(this.enumAppareilsProtectionRespiratoire).filter(Number);
        this.mpcaService.getAll().subscribe((mpca) => {
            this.listMpca = mpca;
        });
        this.typeBatimentService.getAllTypeBatiment().subscribe((typeBatiment) => {
            this.listTypeBatiment = typeBatiment;
        });
        this.outilTechniqueService.getAll().subscribe((outilTechnique) => {
            this.listOutilTechnique = outilTechnique;
        });
        this.travailHumideService.getAll().subscribe((travailHumide) => {
            this.listTravailHumide = travailHumide;
        });
        this.captageAspirationSourceService.getAll().subscribe((captageAspirationSource) => {
            this.listCaptageAspirationSource = captageAspirationSource;
        });
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.tacheProcessusService.getAll(franchise.id).subscribe((tachesProcessus) => {
                this.tachesProcessus = tachesProcessus;
            });
        });


        this.menuService.setMenu([
            ['Comptes / Contacts', '/contact'],
            ['Processus', '/contact/compte/' + this.idCompte + '/activite'],
            [(this.idProcessus ? '#' + this.idProcessus : 'nouveau'), '']
        ]);

        if (this.isNew) {
            this.processusForm.patchValue({ idCompte: Number(this.idCompte) });
        } else {
            this.processusService.get(this.idProcessus).subscribe((processus) => {
                this.processus = processus;
                for (const tacheInstallation of processus.tachesInstallation) {
                    this.addTacheProcessusInstallation(tacheInstallation);
                }
                for (const tacheRetrait of processus.tachesRetrait) {
                    this.addTacheProcessusRetrait(tacheRetrait);
                }
                for (const tacheRepli of processus.tachesRepli) {
                    this.addTacheProcessusRepli(tacheRepli);
                }

                this.processusForm.patchValue(this.processus);
            });
        }
    }

    updateTsatA() {
        const S = 250; // Surface de filtration
        const q = 3; // Débit de la pompe
        const f = 0.5; // Fraction de filtre
        const res = Math.round((7000 * S) / (this.processusForm.controls.niveauAttenduFibresAmiante.value * q * f));
        this.processusForm.controls.tsatA.setValue(res);
    }

    createTacheProcessus(tacheProcessus: TacheProcessus): FormGroup {
        const formGroup = this.formBuilder.group({
            id: [''],
            nom: [''],
            idFranchise: ['']
        });
        formGroup.patchValue(tacheProcessus);
        return formGroup;
    }

    addTacheProcessusInstallation(tacheProcessus: TacheProcessus): void {
        const tachesProcessusInstallation = this.processusForm.get('tachesInstallation') as FormArray;
        tachesProcessusInstallation.push(this.createTacheProcessus(tacheProcessus));
    }

    addTacheProcessusRetrait(tacheProcessus: TacheProcessus) {
        const tachesProcessusRetrait = this.processusForm.get('tachesRetrait') as FormArray;
        tachesProcessusRetrait.push(this.createTacheProcessus(tacheProcessus));
    }

    addTacheProcessusRepli(tacheProcessus: TacheProcessus) {
        const tachesProcessusRepli = this.processusForm.get('tachesRepli') as FormArray;
        tachesProcessusRepli.push(this.createTacheProcessus(tacheProcessus));
    }

    removeTacheProcessusInstallation(tacheProcessus: TacheProcessus): void {
        const tachesProcessusInstallation = this.processusForm.get('tachesInstallation') as FormArray;
        tachesProcessusInstallation.removeAt(tachesProcessusInstallation.value.findIndex(findTacheProcessus => findTacheProcessus.id === tacheProcessus.id));
    }

    removeTacheProcessusRetrait(tacheProcessus: TacheProcessus): void {
        const tachesProcessusRetrait = this.processusForm.get('tachesRetrait') as FormArray;
        tachesProcessusRetrait.removeAt(tachesProcessusRetrait.value.findIndex(findTacheProcessus => findTacheProcessus.id === tacheProcessus.id));
    }

    removeTacheProcessusRepli(tacheProcessus: TacheProcessus): void {
        const tachesProcessusRepli = this.processusForm.get('tachesRepli') as FormArray;
        tachesProcessusRepli.removeAt(tachesProcessusRepli.value.findIndex(findTacheProcessus => findTacheProcessus.id === tacheProcessus.id));
    }


    addTache(type) {
        let foundTache;

        if (type === 'installation') {
            foundTache = this.tachesProcessus.find((tache) => {
                return tache.nom === this.selectedTacheInstallation;
            });
        } else if (type === 'retrait') {
            foundTache = this.tachesProcessus.find((tache) => {
                return tache.nom === this.selectedTacheRetrait;
            });
        } else {
            foundTache = this.tachesProcessus.find((tache) => {
                return tache.nom === this.selectedTacheRetrait;
            });
        }

        if (foundTache) {
            if (type === 'installation') {
                this.addTacheProcessusInstallation(foundTache);
                this.selectedTacheInstallation = '';
            } else if (type === 'retrait') {
                this.addTacheProcessusRetrait(foundTache);
                this.selectedTacheRetrait = '';
            } else {
                this.addTacheProcessusRepli(foundTache);
                this.selectedTacheRepli = '';
            }
        } else {
            const newTacheProcessus = new TacheProcessus();
            newTacheProcessus.idFranchise = this.franchise.id;
            if (type === 'installation') {
                newTacheProcessus.nom = this.selectedTacheInstallation;
            } else if (type === 'retrait') {
                newTacheProcessus.nom = this.selectedTacheRetrait;
            } else {
                newTacheProcessus.nom = this.selectedTacheRepli;
            }
            this.tacheProcessusService.add(newTacheProcessus).subscribe((tachesProcessus) => {
                if (type === 'installation') {
                    this.addTacheProcessusInstallation(tachesProcessus);
                    this.selectedTacheInstallation = '';
                } else if (type === 'retrait') {
                    this.addTacheProcessusRetrait(tachesProcessus);
                    this.selectedTacheRetrait = '';
                } else {
                    this.addTacheProcessusRepli(tachesProcessus);
                    this.selectedTacheRepli = '';
                }
            });
        }
    }

    onSubmit({ value, valid }: { value: Processus, valid: boolean }) {
        console.log(valid);
        if (valid) {
            if (value.id) {
                this.processusService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Processus mis à jour.']);

                    if (this.isModal) {
                        this.emitProcessus.emit(value);
                    } else {
                        this.router.navigate(['/contact/compte', this.idCompte, 'processus']);
                    }
                });
            } else {
                this.processusService.create(value).subscribe((nvProcessus) => {
                    this.notificationService.setNotification('success', ['Processus créé correctement.']);

                    if (this.isModal) {
                        this.emitProcessus.emit(nvProcessus);
                    } else {
                        this.router.navigate(['/contact/compte', this.idCompte, 'processus']);
                    }
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification(
                'danger', this.validationService.getFormValidationErrors(this.processusForm, this.champsInformations)
            );
        }
    }
}
