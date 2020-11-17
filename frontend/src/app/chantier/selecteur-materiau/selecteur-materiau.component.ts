import { BesoinClientLabo, Objectif, InfosBesoinClientLabo, MateriauZone, Liste } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { Franchise } from '../../resource/franchise/franchise';
import { MomentObjectif } from '@aleaac/shared';
import { MomentObjectifService } from '../../resource/objectif/moment-objectif.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectifService } from '../../resource/objectif/objectif.service';
import { ActivatedRoute } from '@angular/router';
import { MateriauZoneService } from '../../resource/materiau-construction-amiante/materiau-zone.service';
import { MateriauConstructionAmiante } from '@aleaac/shared';
import { MateriauConstructionAmianteService } from '../../resource/materiau-construction-amiante/materiau-construction-amiante.service';
import { EnumListeMateriauxAmiante } from '@aleaac/shared';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { ListeService } from '../../resource/liste/liste.service';

@Component({
    selector: 'app-selecteur-materiau',
    templateUrl: './selecteur-materiau.component.html',
    styleUrls: ['./selecteur-materiau.component.scss']
})
export class SelecteurMateriauZoneComponent implements OnInit {
    @Input() currentMateriau: MateriauConstructionAmiante | null = null;
    @Input() currentMateriauAutre: string | null = null;
    @Input() canEdit: boolean = true;

    @Output() emitMateriau = new EventEmitter<MateriauConstructionAmiante>();
    @Output() emitMateriauAutre = new EventEmitter<Liste>();

    franchise: Franchise;
    isPatchValueDone: boolean = true;

    listesOfficiellesMateriaux: MateriauConstructionAmiante[];
    listeA: MateriauConstructionAmiante[];
    listeB: MateriauConstructionAmiante[];
    listeC: MateriauConstructionAmiante[];
    listeMateriauxAutres: Liste[];
    liste: string = '1';
    partiesStructure: string[];
    currentPartieStructure: string | null = null;
    composants: string[];
    currentComposant: string | null = null;
    partiesComposant: string[];
    currentPartieComposant: string | null = null;

    @Input() currentMateriauAutreListe: Liste | null = null;

    formMateriau: FormGroup;

    constructor(
        private notificationService: NotificationService,
        private materiauConstructionAmianteService: MateriauConstructionAmianteService,
        private materiauZoneService: MateriauZoneService,
        private franchiseService: FranchiseService,
        private listeService: ListeService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) {
        this.formMateriau = this.formBuilder.group({
            autreMateriau: [null, Validators.required],
        });

        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    ngOnInit() {
        this.materiauConstructionAmianteService.getAllMateriauConstructionAmiante().subscribe(data => {
            this.listesOfficiellesMateriaux = data;

            this.listeA = [...this.listesOfficiellesMateriaux].filter(m => m.liste === EnumListeMateriauxAmiante.A);
            this.listeB = [...this.listesOfficiellesMateriaux].filter(m => m.liste === EnumListeMateriauxAmiante.B);
            this.listeC = [...this.listesOfficiellesMateriaux].filter(m => m.liste === EnumListeMateriauxAmiante.C);

            if (!this.currentMateriau && !this.currentMateriauAutre) {
                this.setListe('A');
            } else if (this.currentMateriau && !this.currentMateriauAutre) {
                this.liste = this.currentMateriau.liste.toString();
                this.setListe(this.liste, false);
                this.initFromMateriau(this.currentMateriau);
            } else if (this.currentMateriauAutre) {
                this.liste = 'Autres';
                this.formMateriau.patchValue({ autreMateriau: this.currentMateriauAutre });
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    initFromMateriau(materiau: MateriauConstructionAmiante) {
        this.currentPartieStructure = materiau.partieStructure;
        this.currentComposant = materiau.composantConstruction;
        this.currentPartieComposant = materiau.partieComposant;
    }

    setListe(liste, isCreation: boolean = true) {
        this.currentPartieStructure = null;
        this.currentComposant = null;
        this.currentPartieComposant = null;

        switch (this.liste) {
            case '1':
            case 'A':
                this.partiesStructure = [...this.listeA].map(m => m.partieStructure).filter(this.onlyUnique);
                this.composants = [...this.listeA].map(m => m.composantConstruction).filter(this.onlyUnique);
                this.partiesComposant = [...this.listeA].map(m => m.partieComposant).filter(this.onlyUnique);

                if (isCreation) {
                    // Il n'y a que des composants
                    this.currentMateriauAutre = null;
                    this.currentPartieStructure = this.partiesStructure[0];
                    this.currentComposant = this.composants[0];

                    // Il faut au moins un matériau sélectionné si la personen arrive juste sur la page sans rien toucher
                    this.currentMateriau = this.listeA.find(m => m.composantConstruction === this.currentComposant)!;
                    this.emitMateriau.emit(this.currentMateriau);
                }
                break;
            case '2':
            case 'B':
                this.currentMateriauAutre = null;
                this.partiesStructure = [...this.listeB].map(m => m.partieStructure).filter(this.onlyUnique);
                this.composants = [...this.listeB].map(m => m.composantConstruction).filter(this.onlyUnique);
                this.partiesComposant = [...this.listeB].map(m => m.partieComposant).filter(this.onlyUnique);
                break;
            case '3':
            case 'C':
                this.currentMateriauAutre = null;
                this.partiesStructure = [...this.listeC].map(m => m.partieStructure).filter(this.onlyUnique);
                this.composants = [...this.listeC].map(m => m.composantConstruction).filter(this.onlyUnique);
                this.partiesComposant = [...this.listeC].map(m => m.partieComposant).filter(this.onlyUnique);
                break;
            default:
                this.currentMateriau = null;
                this.formMateriau.patchValue({ autreMateriau: this.currentMateriauAutre });
                this.partiesStructure = [];
                this.composants = [];
                this.partiesComposant = [];
                break;
        }
    }

    setPartieStructure(partie) {
        this.currentPartieStructure = partie;
        this.currentComposant = null;
        this.currentPartieComposant = null;
        switch (this.liste) {
            case 'A':
            case '1':
                break;
            case 'B':
            case '2':
                this.composants =
                [...this.listeB].filter(c => c.partieStructure === partie).map(m => m.composantConstruction).filter(this.onlyUnique);
                break;
            case 'C':
            case '3':
                this.composants =
                [...this.listeC].filter(c => c.partieStructure === partie).map(m => m.composantConstruction).filter(this.onlyUnique);
                break;
            default:
                this.partiesStructure = [];
                this.composants = [];
                this.partiesComposant = [];
                break;
        }
    }

    setComposant(comp) {
        this.currentComposant = comp;
        this.currentPartieComposant = null;
        switch (this.liste) {
            case 'A':
            case '1':
                this.currentMateriau = this.listeA.find(m => m.composantConstruction === comp)!;
                this.emitMateriau.emit(this.currentMateriau);
                break;
            case 'B':
            case '2':
                this.partiesComposant =
                [...this.listeB].filter(c => c.composantConstruction === comp).map(m => m.partieComposant).filter(this.onlyUnique);
                break;
            case 'C':
            case '3':
                this.partiesComposant =
                [...this.listeC].filter(c => c.composantConstruction === comp).map(m => m.partieComposant).filter(this.onlyUnique);
                break;
            default:
                break;
        }
    }

    setPartieComposant(partie) {
        this.currentPartieComposant = partie;
        switch (this.liste) {
            case 'A':
            case '1':
                break;
            case 'B':
            case '2':
                this.currentMateriau = this.listeB.find(m => m.partieStructure === this.currentPartieStructure
                    && m.composantConstruction === this.currentComposant && m.partieComposant === partie)!;
                this.emitMateriau.emit(this.currentMateriau);
                break;
            case 'C':
            case '3':
                this.currentMateriau = this.listeC.find(m => m.partieStructure === this.currentPartieStructure
                    && m.composantConstruction === this.currentComposant && m.partieComposant === partie)!;
                this.emitMateriau.emit(this.currentMateriau);
                break;
            default:
                break;
        }
    }

    onSubmit() {
        if (this.formMateriau.get('autreMateriau')!.value.length > 0) {
            this.listeService.createIfNeeded(this.formMateriau.get('autreMateriau')!.value, this.listeMateriauxAutres, this.franchise.id)
                .subscribe((data) => {
                    if (data) {
                        this.currentMateriauAutreListe = data;
                        if (this.listeMateriauxAutres.findIndex(l => l.valeur === data.valeur) === -1) {
                            this.listeMateriauxAutres.push(data);
                        }

                        this.emitMateriauAutre.emit(this.currentMateriauAutreListe!);
                    }

                    console.log('Item enregistré');
                    this.notificationService.setNotification('success', ['Item enregistré.']);
                }, err => {
                    console.error(err);
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
        }
    }

    // Pour filtrer les tableaux en mode "distinct"
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}
