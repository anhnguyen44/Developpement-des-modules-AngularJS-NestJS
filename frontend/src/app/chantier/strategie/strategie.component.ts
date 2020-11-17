import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Franchise } from '../../resource/franchise/franchise';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { UserService } from '../../resource/user/user.service';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';
import { LatLngDto } from '@aleaac/shared/src/dto/chantier/latlng.dto';
import { LegendeDto } from '@aleaac/shared/src/dto/chantier/legende.dto';
import { SitePrelevement, EnumStatutCommande, BesoinClientLabo, InitStrategieFromBesoinDto, EnumStatutStrategie } from '@aleaac/shared';
import { SitePrelevementService } from '../site-prelevement.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { Strategie } from '../../resource/strategie/Strategie';
import { EnumTypeBesoinLabo } from '@aleaac/shared';
import { EnumSousSectionStrategie } from '@aleaac/shared';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { delay } from 'q';
import { UserStore } from '../../resource/user/user.store';
import { EnumTypeStrategie } from '@aleaac/shared';


@Component({
    selector: 'app-strategie',
    templateUrl: './strategie.component.html',
    styleUrls: ['./strategie.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class StrategieComponent implements OnInit {
    idChantier: number;
    chantier: Chantier;
    franchise: Franchise;

    idStrategie: number = 0;
    strategie: Strategie | null;

    isInitialisationEnCours: boolean = false;
    displayInitGeneral: boolean = false;
    displayInitSS3: boolean = false;
    displayInitSS4: boolean = false;
    isValidationEnCours: boolean = false;

    strategiesSS3: Strategie[] = new Array<Strategie>();
    strategiesSS4: Strategie[] = new Array<Strategie>();
    strategiesCSP: Strategie[] = new Array<Strategie>();
    besoin: BesoinClientLabo;
    enumTypeBesoinLabo: typeof EnumTypeBesoinLabo = EnumTypeBesoinLabo;
    enumTypeStrategie: typeof EnumTypeStrategie = EnumTypeStrategie;

    openModalStrategie: boolean = false;
    sousSectionModal: EnumSousSectionStrategie | null = null;
    nextNumberModal: number = 1;
    strategieModal: Strategie = new Strategie();

    canValidateStrategie: boolean = false;
    isStrategieValidee: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private strategieService: StrategieService,
        private userStore: UserStore,
    ) {
        route.params.subscribe((params) => {
            this.idChantier = params.id;
            this.strategie = null; // Pour que ça recharge le composant liste des Zones quand on change l'URL
            if (params.idStrategie) {
                this.idStrategie = Number.parseInt(params.idStrategie);
            }
            if (this.idChantier) {
                this.initListeStrategie(this.idChantier);
            }

            this.franchiseService.franchise.subscribe((franchise) => {
                this.franchise = franchise;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        });
    }

    refresh(): void {
        window.location.reload();
    }

    ngOnInit() {
        this.userStore.hasRight('STRAT_VALIDATE').then(val => {
            this.canValidateStrategie = val;
        });
    }

    initFromBesoin(section: string = '') {
        this.isInitialisationEnCours = true;
        const dtoInit = new InitStrategieFromBesoinDto();
        dtoInit.besoin = this.besoin;
        dtoInit.idChantier = this.idChantier;
        if (section === 'SS3') {
            dtoInit.sousSection = EnumSousSectionStrategie.SS3;
        } else if (section === 'SS4') {
            dtoInit.sousSection = EnumSousSectionStrategie.SS4;
        } else {
            if (this.besoin.ss3 && !this.besoin.ss4) {
                dtoInit.sousSection = EnumSousSectionStrategie.SS3;
            } else if (!this.besoin.ss3 && this.besoin.ss4) {
                dtoInit.sousSection = EnumSousSectionStrategie.SS4;
            } else {
                dtoInit.sousSection = null;
            }
        }

        this.strategieService.initFromBesoin(dtoInit).subscribe((res) => {
            console.log(res);
            this.initListeStrategie(dtoInit.idChantier);
            this.isInitialisationEnCours = false;
            this.notificationService.setNotification('success', ['Initialisation réussie.']);
        }, err => {
            this.isInitialisationEnCours = false;
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        if (section) {
            // Uniquement la section demandée
        } else {
            // Tout

        }
    }

    private initListeStrategie(idChantier: number) {

        this.chantierService.get(this.idChantier).subscribe((chantier) => {
            console.log(chantier);
            this.chantier = chantier;
            this.menuService.setMenu([
                ['Chantiers', '/chantier'],
                ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.idChantier + '/informations'],
                ['Stratégies (V ' + chantier.versionStrategie + ')', '']
            ]);
            this.besoin = chantier.besoinClient;

            // Soit on charge UNE strat, soit la liste
            if (this.idStrategie) {
                this.strategie = this.chantier.strategies.find(s => s.id === this.idStrategie)!;
            } else {
                if (this.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL.valueOf() && this.besoin.ss3 && !this.besoin.ss4) {
                    this.strategiesSS3 =
                        [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS3);
                    this.displayInitGeneral = (this.strategiesSS3.length) === 0;
                } else if (this.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL.valueOf()
                    && this.besoin.ss4 && !this.besoin.ss3) {
                    this.strategiesSS4 =
                        [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS4);
                    this.displayInitGeneral = (this.strategiesSS4.length) === 0;
                } else if (this.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL.valueOf()
                    && this.besoin.ss4 && this.besoin.ss3) {
                    this.strategiesSS3 =
                        [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS3);
                    this.strategiesSS4 =
                        [...this.chantier.strategies].filter(s => s.sousSection && s.sousSection === EnumSousSectionStrategie.SS4);

                    this.displayInitSS4 = (this.strategiesSS4.length) === 0;
                    this.displayInitSS3 = (this.strategiesSS3.length) === 0;

                    this.displayInitGeneral = (this.strategiesSS3.length + this.strategiesSS4.length) === 0;
                } else if (this.besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_SANTE_PUBLIQUE.valueOf()) {
                    this.strategiesCSP = [...this.chantier.strategies].filter(s => s.sousSection === null);
                }
                this.isValidationEnCours = this.chantier.strategies.findIndex(s => s.statut === EnumStatutStrategie.STRAT_A_VALIDER) > -1;
                this.isStrategieValidee = this.chantier.strategies.findIndex(s => s.statut === EnumStatutStrategie.STRAT_VALIDEE) > -1;
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    refreshCmdLiees() {
        const idSave = this.chantier.id;
        delete this.chantier.id;
        setTimeout(() => {
            this.chantier.id = idSave;
        }, 100);
    }

    createStrategie() {

    }

    deleteStrategie(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette stratégie ?')) {
            this.strategieService.removeStrategie(id).subscribe(() => {
                this.initListeStrategie(this.idChantier);
                this.notificationService.setNotification('success', ['Stratégie supprimée.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    addStrategieFromModal(strategie: Strategie) {
        this.initListeStrategie(strategie.idChantier);
    }

    editStrategie(strategie: Strategie, sousSection: string) {
        // TODO : truc pour set strat puis openModal
        this.strategieModal = strategie;
        this.openLaModalStrategie(sousSection, true);
    }

    openLaModalStrategie(sousSection: string = '', isForEdit: boolean = false) {
        if (!isForEdit) {
            this.strategieModal = new Strategie();
        }

        if (!sousSection || sousSection === '') {
            this.sousSectionModal = null;
            this.nextNumberModal = this.strategiesCSP.length + 1;
        } else {
            switch (sousSection) {
                case 'SS3':
                    this.sousSectionModal = EnumSousSectionStrategie.SS3;
                    this.nextNumberModal = this.strategiesSS3.length + this.strategiesSS4.length + 1;
                    break;
                case 'SS4':
                    this.sousSectionModal = EnumSousSectionStrategie.SS4;
                    this.nextNumberModal = this.strategiesSS3.length + this.strategiesSS4.length + 1;
                    break;
                default:
                    this.sousSectionModal = null;
                    this.nextNumberModal = this.strategiesCSP.length + 1;
                    break;
            }
        }
        this.openModalStrategie = true;
    }

    closeModalStrategie() {
        this.openModalStrategie = false;
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
                this.isStrategieValidee = true;
                this.chantier.versionStrategie++;

                this.menuService.setMenu([
                    ['Chantiers', '/chantier'],
                    ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.idChantier + '/informations'],
                    ['Stratégies (V ' + this.chantier.versionStrategie + ')', '']
                ]);
            });
        }
    }

    unlock() {
        if (confirm('Voulez-vous modifier cette stratégie ? Cela créera une nouvelle version.')) {
            this.chantierService.unlock(this.chantier).subscribe(() => {
                this.notificationService.setNotification('success', ['Stratégie dévérouillée.']);
                this.isValidationEnCours = false;
                this.isStrategieValidee = false;
            });
        }
    }
}
